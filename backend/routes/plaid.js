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


async function getUserIdFromItemId(item_id) {
  // Query your database to find the user ID associated with the given item ID
  try {
      const account = await Account.findByItemId(item_id);
      if (account) {
          return account.user_id;  // Assuming your account model has a user_id field
      } else {
          // Handle the case where no account is found for the given item ID
          console.error(`No account found for item_id: ${item_id}`);
          return null;  // Or handle this scenario as appropriate for your application
      }
  } catch (error) {
      console.error(`Error fetching user ID for item_id ${item_id}:`, error);
      return null;  // Or handle this error as needed
  }
}


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
  const accessToken = req.body.access_token;
  const accountId = req.body.accountId;
  const request = {
    access_token: accessToken,
    options: {
      include_personal_finance_category: true,
    },
  };

  try {
    const transactionResult = await plaidClient.transactionsSync(request);
    let newTransactions = transactionResult.data.added || [];
    let expensesCreated = [];
    let duplicateExpenses = [];

    for (let transaction of newTransactions) {
      let categoryId;
      try {
        categoryId = mapCategory(transaction.personal_finance_category.primary);
      } catch (err) {
        console.error('Error mapping category:', err.message);
        continue; // Skips to the next iteration in the loop
      }

      let expenseData = {
        amount: transaction.amount,
        date: transaction.date,
        vendor: transaction.merchant_name,
        description: transaction.name,
        category_id: categoryId,
        user_id: res.locals.user.id,
        transaction_id: transaction.transaction_id,
        account_id: accountId
      };

      try {
        const expense = await Expense.create(res.locals.user.id, expenseData);
        expensesCreated.push(expense);
      } catch (err) {
        if (err instanceof BadRequestError && err.message.startsWith('Duplicate expense')) {
          // Log and skip duplicates, but keep track of them
          duplicateExpenses.push(transaction.transaction_id);
          console.log('Duplicate transaction skipped:', transaction.transaction_id);
        } else {
          console.error('/transactions/sync error:', err.message);
          // Log and handle other types of errors as needed
        }
      }
    }

    const io = req.app.get('io');
    io.emit('transactions_synced', { 
    user_id: res.locals.user.id,
     expenses: expensesCreated,
     duplicatesSkipped: duplicateExpenses.length
     });

    return res.json({
      message: "Transactions synced successfully",
      expenses: expensesCreated,
      duplicatesSkipped: duplicateExpenses.length
    });

  } catch (err) {
    console.error('Error syncing transactions:', err.message);
    res.status(500).json({
      message: 'Error syncing transactions',
      details: err.message,
      type: err.name
    });
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
      const { webhook_code, new_transactions } = req.body;

      if (['INITIAL_UPDATE', 'HISTORICAL_UPDATE', 'DEFAULT_UPDATE'].includes(webhook_code)) {
          for (const transaction of new_transactions) {
              try {
                  const categoryId = mapCategory(transaction.personal_finance_category.primary);
                  const userId = await getUserIdFromItemId(transaction.item_id);

                  const expenseData = {
                      amount: transaction.amount,
                      date: transaction.date,
                      vendor: transaction.merchant_name,
                      description: transaction.name,
                      category_id: categoryId,
                      user_id: userId,
                      transaction_id: transaction.transaction_id,
                  };

                  // Create or update the expense in your database
                  await Expense.createOrUpdate(expenseData);
              } catch (error) {
                  console.error('Error processing transaction from webhook:', error);
              }
          }

          // Emit a WebSocket event to update frontend
          io.emit('new_transaction', { user_id: userId, new_transactions });

          res.status(200).json({ acknowledgment: 'Webhook received and processed' });
      } else {
          res.status(200).json({ message: 'Webhook code not handled' });
      }
  } catch (err) {
      console.error('Error handling Plaid webhook:', err);
      return next(err);
  }
});

module.exports = router;