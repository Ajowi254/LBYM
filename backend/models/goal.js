//goal.js
const db = require("../db");

class Goal {
  static async create({ user_id, category_id, goal_amount, description }) {
    const result = await db.query(
      `INSERT INTO goals (user_id, category_id, goal_amount, description)
       VALUES ($1, $2, $3, $4)
       RETURNING id, user_id, category_id, goal_amount, description`,
      [user_id, category_id, goal_amount, description]
    );
    return result.rows[0];
  }

  static async findAllForUser(user_id) {
    const result = await db.query(
      `SELECT id, user_id, category_id, goal_amount, description
       FROM goals
       WHERE user_id = $1`,
      [user_id]
    );
    return result.rows;
  }

  static async update(id, { goal_amount, description }) {
    const result = await db.query(
      `UPDATE goals
       SET goal_amount = $1, description = $2
       WHERE id = $3
       RETURNING id, user_id, category_id, goal_amount, description`,
      [goal_amount, description, id]
    );
    return result.rows[0];
  }

  static async remove(id) {
    const result = await db.query(
      `DELETE FROM goals
       WHERE id = $1
       RETURNING id`,
      [id]
    );
    return result.rows[0];
  }
}

module.exports = Goal;
