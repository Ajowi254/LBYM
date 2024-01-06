//plaid.js
/** Routes for Plaid API. */

const express = require("express");
const router = express.Router();
const { plaidClient } = require("../config");
const { io } = require('../server');

const Account = require("../models/account");
const Expense = require("../models/expense");
const Goal = require("../models/goal");
const { mapCategory } = require("../helpers/category");

router.post('/create_link_token', async function (req, res, next) {
  const userId = String(res.locals.user.id) || null;
  const plaidRequest = {
    user: {
      client_user_id: userId
    },
    client_name: 'Plaid App',
    products: ['auth', 'transactions'],
    language: 'en',
    redirect_uri: 'http://localhost:3000/',
    country_codes: ['US'],
    environment: process.env.REACT_APP_PLAID_ENVIRONMENT, // Change to REACT_APP_PLAID_ENVIRONMENT
  };
  
  try {
    const createTokenResponse = await plaidClient.linkTokenCreate(plaidRequest);
    return res.json(createTokenResponse.data);
  } catch (err) {
    console.error('create_link_token error', err);
    return next(err);
  }
});

router.post('/exchange_public_token', async function (req, res, next
) {
  const publicToken = req.body.public_token;
  const { name, institution_id } = req.body.metadata.institution; 
  const { id: accID, name: accType } = req.body.metadata.account;
   
  try {
    const plaidResponse = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });
    // These values should be saved to a persistent database and
    // associated with the currently signed-in user
    const accessToken = plaidResponse.data.access_token;
    const itemID = plaidResponse.data.item_id;

    const accData = {
      user_id: res.locals.user.id,
      access_token: accessToken,
      item_id: itemID,
      account_id: accID,
      institution_id: institution_id,
      institution_name: name,
      account_type: accType
    }

    const account = await Account.create(accData);

    return res.json({ accessToken });
  } catch (error) {
    return next(error);
  }
});

router.post('/transactions/sync', async function (req, res, next) {
  const access_token = req.body.access_token;
  const account_id = req.body.accountId;
  const request = {
    access_token: access_token,
    options: {
      include_personal_finance_category: true,
    },
  };

  try {
    const transactionResult = await plaidClient.transactionsSync(request);
    let newTransactions = transactionResult.data.added || [];
    let expensesCreated = []; // To store created expenses and emit later

    for (let transaction of newTransactions) {
      let convertedId = mapCategory(transaction.personal_finance_category.primary);
      
      let data = {
        amount: transaction.amount,
        date: transaction.date,
        vendor: transaction.merchant_name,
        description: transaction.name,
        category_id: convertedId,
        user_id: res.locals.user.id,
        transaction_id: transaction.transaction_id,
        account_id: account_id
      };

      try {
        const expense = await Expense.create(res.locals.user.id, data);
        expensesCreated.push(expense); // Add the new expense to the array
        await Goal.updateProgress(expense); // Update the goal progress
      } catch (err) {
        console.error('/transactions/sync error at data:', data, err);
        return next(err);
      }
    }

    // After processing all new transactions, emit a WebSocket event with the new expenses
    io.emit('transactions_synced', { user_id: res.locals.user.id, expenses: expensesCreated });

    return res.json(transactionResult.data);
  } catch (err) {
    return next(err);
  }
});
router.post('/auth/get', async function (req, res, next) {
  const access_token = req.body.access_token;
  const request = {
    access_token: access_token,
  };
  try {
    const authResult = await plaidClient.authGet(request);
    return res.json(authResult.data);
  } catch (err) {
    return next(err);
  }
});
// Handle Plaid's webhook for new transactions
router.post('/transactions/webhook', async function (req, res, next) {
  try {
    // Assume we receive the necessary data from Plaid's webhook in req.body
    const { webhook_code, new_transactions } = req.body;

    if (webhook_code === 'INITIAL_UPDATE' || webhook_code === 'HISTORICAL_UPDATE' || webhook_code === 'DEFAULT_UPDATE') {
      // Process the new transactions...
      // For each transaction, map the category, create an expense, update the goal progress
      // and then emit a WebSocket event with the updated data.
      
      // Acknowledge the webhook event
      res.status(200).json({ acknowledgment: 'Webhook received' });

      // Here, you'd implement logic similar to your existing transaction sync logic
      // After processing the new transactions, emit an update
      io.emit('new_transaction', { user_id: 'someUserId', new_transactions }); // Replace 'someUserId' with actual user ID from your authentication system
    }
  } catch (err) {
    console.error('Error handling Plaid webhook:', err);
    return next(err);
  }
});
module.exports = router;