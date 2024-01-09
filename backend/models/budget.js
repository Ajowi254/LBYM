// models/Budget.js
const db = require("../db");

class Budget {
  static async setOrUpdateBudget(userId, categoryId, budgetLimit) {
    const result = await db.query(
      `INSERT INTO category_budgets (user_id, category_id, budget_limit)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, category_id)
       DO UPDATE SET budget_limit = EXCLUDED.budget_limit
       RETURNING id, user_id, category_id, budget_limit`,
      [userId, categoryId, budgetLimit]
    );
    return result.rows[0];
  }

  static async getBudgets(userId) {
    const result = await db.query(
      `SELECT category_id, budget_limit FROM category_budgets WHERE user_id = $1`,
      [userId]
    );
    return result.rows;
  }
}

module.exports = Budget;
