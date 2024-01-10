// models/categoryBudget.js
const db = require("../db");

class CategoryBudget {
    static async create({ user_id, category_id, budget_limit, description }) {
        const result = await db.query(
            `INSERT INTO category_budgets (user_id, category_id, budget_limit, description)
             VALUES ($1, $2, $3, $4)
             RETURNING id, user_id, category_id, budget_limit, description`,
            [user_id, category_id, budget_limit, description]
        );
        return result.rows[0];
    }

    static async findAllForUser(user_id) {
        const result = await db.query(
            `SELECT id, user_id, category_id, budget_limit, description
             FROM category_budgets
             WHERE user_id = $1`,
            [user_id]
        );
        return result.rows;
    }

    static async update(id, { budget_limit, description }) {
        const result = await db.query(
            `UPDATE category_budgets
             SET budget_limit = $1, description = $2
             WHERE id = $3
             RETURNING id, user_id, category_id, budget_limit, description`,
            [budget_limit, description, id]
        );
        return result.rows[0];
    }

    static async remove(id) {
        const result = await db.query(
            `DELETE FROM category_budgets
             WHERE id = $1
             RETURNING id`,
            [id]
        );
        return result.rows[0];
    }
}

module.exports = CategoryBudget;
