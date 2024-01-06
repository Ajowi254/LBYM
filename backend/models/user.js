//models=users.js
const db = require("../db");
const bcrypt = require("bcrypt");
const { UnauthorizedError, BadRequestError, NotFoundError } = require("../expressErrors");
const { partialUpdateSql } = require("../helpers/sql");
const BCRYPT_WORK_FACTOR = +process.env.BCRYPT_WORK_FACTOR;

class User {
  /** Authenticate user with username and password. */
  static async authenticate(username, password) {
    const result = await db.query(`
      SELECT id, username, password, first_name, last_name, email
      FROM users
      WHERE username = $1`, 
      [username]
    );

    const user = result.rows[0];
    if (user) {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        delete user.password;
        return user;
      }
    }
    throw new UnauthorizedError('Invalid username/password');
  }

  /** Register user with data. */
  static async register({ username, password, firstName, lastName, email }) {
    const duplicateCheck = await db.query(`
      SELECT username
      FROM users
      WHERE username = $1`,
      [username]
    );
    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    const result = await db.query(`
      INSERT INTO users
        (username, password, first_name, last_name, email)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, username, first_name AS "firstName", last_name AS "lastName", email`,
      [username, hashedPassword, firstName, lastName, email]
    );
    
    const user = result.rows[0];

    return user;
  }

  /** Find all users. */
  static async findAll() {
    const result = await db.query(`
      SELECT id, username, first_name AS "firstName", last_name AS "lastName", email
      FROM users
      ORDER BY username`
    );

    return result.rows;
  }

  /** Given user id, return data about the user. */
  static async get(user_id) {
    const userRes = await db.query(`
      SELECT id, username, first_name AS "firstName", last_name AS "lastName", email
      FROM users
      WHERE id = $1`,
      [user_id]
    );

    const user = userRes.rows[0];
    if (!user) throw new NotFoundError(`No user id: ${user_id}`);

    return user;
  }

  /** Update user data. */
  static async update(user_id, password, data) {
    const isCorrectUser = await db.query(`
      SELECT id, password
      FROM users
      WHERE id = $1`,
      [user_id]
    );

    if (isCorrectUser.rows.length === 0) throw new NotFoundError(`No user id: ${user_id}`);
    const isCorrectPassword = await bcrypt.compare(password, isCorrectUser.rows[0].password);
    if (!isCorrectPassword) throw new UnauthorizedError('Invalid password');

    const { setCols, values } = partialUpdateSql(
      data, 
      {
        firstName: "first_name",
        lastName: "last_name"
      }
    );
    const idPosition = "$" + (values.length + 1);
    const sqlQuery = `
      UPDATE users 
      SET ${setCols} 
      WHERE id = ${idPosition} 
      RETURNING id, username, first_name AS "firstName", last_name AS "lastName", email`;
    const result = await db.query(sqlQuery, [...values, user_id]);
    const user = result.rows[0];

    return user;
  }

  /** Delete the given user from the database. */
  static async remove(user_id) {
    let result = await db.query(`
      DELETE
      FROM users
      WHERE id = $1
      RETURNING username`,
      [user_id]
    );

    const user = result.rows[0];
    if (!user) throw new NotFoundError(`No user id: ${user_id}`);

    return user.username;
  }

  /** Find user by username. */
  static async findByUsername(username) {
    const result = await db.query(
      `
      SELECT id, username, first_name, last_name, email
      FROM users
      WHERE username = $1
    `,
      [username]
    );

    return result.rows[0] || null;
  }

/** Update the profile picture URL of a user. */
static async updateProfilePic(userId, url) {
  const result = await db.query(`
    UPDATE users 
    SET profile_pic_url = $1 
    WHERE id = $2 
    RETURNING id, username, first_name AS "firstName", last_name AS "lastName", email, profile_pic_url`,
    [url, userId]
  );

  const user = result.rows[0];
  if (!user) throw new NotFoundError(`No user with id: ${userId}`);
  return user;
}

/** Remove a user's profile picture URL. */
static async deleteProfilePic(userId) {
  const result = await db.query(`
    UPDATE users 
    SET profile_pic_url = NULL 
    WHERE id = $1 
    RETURNING id, username, first_name AS "firstName", last_name AS "lastName", email, profile_pic_url`,
    [userId]
  );

  const user = result.rows[0];
  if (!user) throw new NotFoundError(`No user with id: ${userId}`);
  return user;
}
  static async getHomepageData(user_id) {
    // Fetch goals and their progress
    const goalsResult = await db.query(`
      SELECT g.id, goal_name, target_amount, current_amount, category_id
      FROM goals g
      WHERE user_id = $1`,
      [user_id]
    );

    // Fetch expenses aggregated by category
    const expensesResult = await db.query(`
      SELECT category_id, SUM(amount) AS total_spent
      FROM expenses
      WHERE user_id = $1
      GROUP BY category_id`,
      [user_id]
    );

    return {
      goals: goalsResult.rows,
      expensesByCategory: expensesResult.rows,
    };
  }
}

module.exports = User;
