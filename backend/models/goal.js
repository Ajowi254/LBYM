// model=goal.js
const db = require("../db");
const { NotFoundError } = require("../expressErrors");

class Goal {

  // Given goal id, return data about goal.
  static async get(user_id, goal_id) {
    const result = await db.query(
      `SELECT g.id, goal_name, target_amount, current_amount, category_id, user_id
       FROM goals g
       WHERE g.id = $1 AND user_id = $2`,
      [goal_id, user_id]
    );

    const goal = result.rows[0];
    if (!goal) {
      throw new NotFoundError(`No goal id: ${goal_id}`);
    }

    return goal;
  }

  // Find all goals for a single user based on user id.
  static async getAll(user_id) {
    const result = await db.query(
      `SELECT g.id, goal_name, target_amount, current_amount, category_id
       FROM goals g
       WHERE user_id = $1`,
      [user_id]
    );

    return result.rows;
  }

  // Create a goal from data.
  static async create(user_id, { goal_name, target_amount, category_id, due_date }) {
    const currentAmountResult = await db.query(
      `SELECT SUM(amount) AS total
       FROM expenses
       WHERE user_id = $1 AND category_id = $2`,
      [user_id, category_id]
    );

    const currentAmount = currentAmountResult.rows[0]?.total ?? 0;

    const result = await db.query(
      `INSERT INTO goals (goal_name, target_amount, current_amount, category_id, user_id, due_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, goal_name, target_amount, current_amount, category_id, user_id`,
      [goal_name, target_amount, currentAmount, category_id, user_id, due_date]
    );

    return result.rows[0];
  }

  // Update goal amount for a specific goal_id.
  static async update(user_id, goal_id, { target_amount, current_amount }) {
    const result = await db.query(
      `UPDATE goals 
       SET target_amount = $1, current_amount = $2
       WHERE id = $3 AND user_id = $4
       RETURNING id, goal_name, target_amount, current_amount, category_id`,
      [target_amount, current_amount, goal_id, user_id]
    );

    const goal = result.rows[0];
    if (!goal) {
      throw new NotFoundError(`No goal id: ${goal_id}`);
    }

    return goal;
  }

  // Delete given goal from database; returns undefined.
  static async remove(user_id, goal_id) {
    const result = await db.query(
      `DELETE FROM goals WHERE id = $1 AND user_id = $2 RETURNING id`,
      [goal_id, user_id]
    );

    const goal = result.rows[0];
    if (!goal) {
      throw new NotFoundError(`No goal id: ${goal_id}`);
    }
  }

  // Update the progress of a goal based on a new expense.
  static async updateProgress(user_id, category_id, amount) {
    const goals = await db.query(
      `SELECT id, current_amount 
       FROM goals 
       WHERE user_id = $1 AND category_id = $2`,
      [user_id, category_id]
    );

    for (const goal of goals.rows) {
      const newCurrentAmount = parseFloat(goal.current_amount) + parseFloat(amount);
      await db.query(
        `UPDATE goals 
         SET current_amount = $1 
         WHERE id = $2`,
        [newCurrentAmount, goal.id]
      );
    }
  }
}

module.exports = Goal;
