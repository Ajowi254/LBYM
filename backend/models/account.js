// models=account.js
const db = require("../db");

const { BadRequestError, NotFoundError } = require("../expressErrors");
const Expense = require("./expense");
class Account {

/** Find all accounts for a single user based on user id.
    Returns [{ id, access_token, item_id, account_id, institution_name, account)type }, ...]
*/

static async getAll(user_id) {
  const result = await db.query(`
    SELECT id, access_token, item_id, account_id, institution_name, account_type 
    FROM accounts e
    WHERE user_id = $1
    ORDER BY institution_name`,
    [user_id]
  );

  return result.rows;
}

/** Create an account from Plaid data. See plaid route.
    Data should be { userID, accessToken, itemID, accountID, institutionID, institutionName, accountType } 
    Returns { institution name } 
    Throws BadRequestError for duplicate account.
*/

static async create({ user_id, access_token, item_id, account_id, institution_id, institution_name, account_type }) {
  const duplicateCheck = await db.query(`
    SELECT user_id, account_id 
    FROM accounts
    WHERE user_id = $1 
    AND account_id = $2`,
    [user_id, account_id])

  if (duplicateCheck.rows[0]) throw new BadRequestError('Account already exists');

  const result = await db.query(`
    INSERT INTO accounts
    (user_id, access_token, item_id, account_id, institution_id, institution_name, account_type)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, institution_name`,
    [user_id, access_token, item_id, account_id, institution_id, institution_name, account_type])
    
  const account = result.rows[0];
  return account;
}

/** Delete given account from database; returns undefined. */
// In models/account.js

/** Delete given account from database; returns undefined. */

// models/account.js
// In models/accounts.js

static async remove(user_id, account_id) {
  // Start a transaction
  await db.query("BEGIN");

  try {
    // Delete the expenses associated with the account
    await db.query(
      `DELETE FROM expenses WHERE account_id = $1 AND user_id = $2`,
      [account_id, user_id]
    );

    // Recalculate the sum of expenses by category
    const aggregatedExpenses = await Expense.getSumByCategory(user_id);

    // Delete the account
    const result = await db.query(
      `DELETE FROM accounts WHERE id = $1 AND user_id = $2 RETURNING id`,
      [account_id, user_id]
    );

    const account = result.rows[0];

    if (!account) throw new NotFoundError(`No account id: ${account_id}`);

    // Commit the transaction
    await db.query("COMMIT");

    return { account, aggregatedExpenses };
  } catch (err) {
    // If there was a problem, rollback the transaction
    await db.query("ROLLBACK");
    throw err;
  }
}
}
module.exports = Account;