//models-category.js
const db = require("../db");
class Category {
  static async getAll() {
    try {
      const result = await db.query(
        `SELECT id, category FROM categories`
      );
      return result.rows;
    } catch (err) {
      console.error(`Error occurred while fetching all categories: ${err}`);
      throw err;
    }
  }

  static async getExpensesByCategory(user_id, category_id = null) {
    try {
      if (category_id) {
        const result = await db.query(
          `SELECT SUM(e.amount) as total_expenses
          FROM expenses e
          WHERE e.user_id = $1 AND e.category_id = $2
          GROUP BY e.category_id`,
          [user_id, category_id]
        );
        if (result.rows.length === 0) {
          return null;
        }
        return result.rows[0];
      } else {
        const result = await db.query(
          `SELECT c.id, c.category, COALESCE(SUM(e.amount), 0) as total_expenses
          FROM categories c
          LEFT JOIN expenses e ON c.id = e.category_id AND e.user_id = $1
          GROUP BY c.id
          ORDER BY c.id`,
          [user_id]
        );
        return result.rows;
      }
    } catch (err) {
      console.error(`Error occurred while fetching expenses by category: ${err}`);
      throw err;
    }
  }

  static async updateOverBudgetStatus(categoryId) {
    try {
      const result = await db.query(
        `SELECT SUM(amount) AS total_spent, budget_limit 
        FROM expenses JOIN categories ON expenses.category_id = categories.id
        WHERE category_id = $1
        GROUP BY budget_limit`, [categoryId]
      );
      
      if (result.rows.length === 0) {
        throw new NotFoundError(`Category not found: ${categoryId}`);
      }

      const { total_spent, budget_limit } = result.rows[0];
      const isOverBudget = total_spent > budget_limit;

      await db.query(
        `UPDATE categories SET is_over_budget = $1 WHERE id = $2`,
        [isOverBudget, categoryId]
      );
    } catch (err) {
      console.error(`Error occurred while updating over budget status: ${err}`);
      throw err;
    }
  }
}
module.exports = Category;
