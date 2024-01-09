// models/Budget.js
const db = require("../db");

class Budget {
  // Method to set a new budget
  static async setBudget(userId, categoryId, budgetLimit) {
    const duplicateCheck = await db.query(
      `SELECT * FROM category_budgets WHERE user_id = $1 AND category_id = $2`,
      [userId, categoryId]
    );

    if (duplicateCheck.rows[0]) {
      throw new Error('Budget for this category already exists for the user');
    }

    const result = await db.query(
      `INSERT INTO category_budgets (user_id, category_id, budget_limit)
       VALUES ($1, $2, $3)
       RETURNING id, user_id, category_id, budget_limit`,
      [userId, categoryId, budgetLimit]
    );

    return result.rows[0];
  }

  // Method to update an existing budget
  static async updateBudget(userId, categoryId, budgetLimit) {
    const result = await db.query(
      `UPDATE category_budgets
       SET budget_limit = $3
       WHERE user_id = $1 AND category_id = $2
       RETURNING id, user_id, category_id, budget_limit`,
      [userId, categoryId, budgetLimit]
    );

    if (result.rows.length === 0) {
      throw new Error('Budget does not exist for this category for the user');
    }

    return result.rows[0];
  }

  // Method to retrieve all budgets for a user
  static async getBudgets(userId) {
    const result = await db.query(
      `SELECT category_id, budget_limit FROM category_budgets WHERE user_id = $1`,
      [userId]
    );
    return result.rows;
  }
}

module.exports = Budget;
