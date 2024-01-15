//expense.js
const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressErrors");

class Expense {
    static async get(user_id, expense_id) {
        const result = await db.query(
            `SELECT e.id, amount, date, vendor, description, e.category_id, c.category, user_id, transaction_id
            FROM expenses e
            JOIN categories c ON e.category_id = c.id
            WHERE e.id = $1 AND user_id = $2`,
            [expense_id, user_id]
        );

        const expense = result.rows[0];
        if (!expense) throw new NotFoundError(`No expense id: ${expense_id}`);
        return expense;
    }

    static async findAll(user_id) {
        const result = await db.query(
            `SELECT e.id, amount, date, vendor, description, e.category_id, c.category, transaction_id
            FROM expenses e
            JOIN categories c ON e.category_id = c.id
            WHERE user_id = $1
            ORDER BY date DESC`,
            [user_id]
        );

        return result.rows;
    }
    static async create(user_id, { amount, date, vendor, description, category_id, transaction_id }) {
        let createdExpense;
        if (transaction_id) {
          const duplicateCheck = await db.query(
            `SELECT transaction_id FROM expenses WHERE transaction_id = $1`,
            [transaction_id]
          );
      
          if (duplicateCheck.rows[0]) {
            // Log the duplicate and skip inserting it
            console.log(`Skipping duplicate expense: ${transaction_id}`);
          } else {
            const result = await db.query(
              `INSERT INTO expenses
              (amount, date, vendor, description, category_id, user_id, transaction_id)
              VALUES ($1, $2, $3, $4, $5, $6, $7)
              RETURNING id, amount, date, vendor, description, category_id, user_id, transaction_id`,
              [amount, date, vendor, description, category_id, user_id, transaction_id]
            );
            createdExpense = result.rows[0];
          }
        }
        return createdExpense;
      }
      

    static async update(user_id, expense_id, data) {
        const { setCols, values } = partialUpdateSql(data, {});
        const expIdPosition = "$" + (values.length + 1);
        const userIdPosition = "$" + (values.length + 2);

        const sqlQuery = `
            UPDATE expenses 
            SET ${setCols} 
            WHERE id = ${expIdPosition} AND user_id = ${userIdPosition}
            RETURNING id, amount, date, vendor, description, category_id`;

        const result = await db.query(sqlQuery, [...values, expense_id, user_id]);
        const expense = result.rows[0];

        if (!expense) throw new NotFoundError(`No expense id: ${expense_id}`);

        return expense;
    }

    static async remove(user_id, expense_id) {
        const result = await db.query(
            `DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING id`,
            [expense_id, user_id]
        );

        return result.rows[0];
    }

   // Fetch expenses by category with improved error handling
   static async fetchByCategory(userId, categoryId) {
    const result = await db.query(
        `SELECT * FROM expenses WHERE user_id = $1 AND category_id = $2`, 
        [userId, categoryId]
    );

    if (result.rows.length === 0) {
        return []; // Return an empty array for consistency
    }
    return result.rows;
}

static async createOrUpdate({ amount, date, vendor, description, category_id, user_id, transaction_id }) {
    const duplicateCheck = await db.query(
        `SELECT id FROM expenses WHERE transaction_id = $1 AND user_id = $2`,
        [transaction_id, user_id]
    );

    if (duplicateCheck.rows.length > 0) {
        const expenseId = duplicateCheck.rows[0].id;
        return await this.update(user_id, expenseId, { amount, date, vendor, description, category_id });
    } else {
        return await this.create(user_id, { amount, date, vendor, description, category_id, transaction_id });
    }
}

static async removeByAccountId(accountId) {
    await db.query(
        `DELETE FROM expenses WHERE account_id = $1`,
        [accountId]
    );
}

static async aggregateByCategory(userId) {
    const result = await db.query(
      `SELECT c.id AS category_id, c.category, SUM(e.amount) AS total
       FROM categories c
       INNER JOIN expenses e ON e.category_id = c.id AND e.user_id = $1
       GROUP BY c.id`, 
      [userId]
    );
  
    return result.rows;
  };
}

module.exports = Expense;
