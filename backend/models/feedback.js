// backend/models/feedback.js

const db = require('../db');

class Feedback {
  static async create(userId, selectedOption) {
    const result = await db.query(
      'INSERT INTO feedback (user_id, selected_option) VALUES ($1, $2) RETURNING *',
      [userId, selectedOption]
    );
    return result.rows[0];
  }
}

module.exports = Feedback;