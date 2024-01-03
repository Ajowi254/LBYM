// user.js
const db = require("../db");
const bcrypt = require("bcrypt");
const { UnauthorizedError, BadRequestError, NotFoundError } = require("../expressErrors");
const { partialUpdateSql } = require("../helpers/sql");
const cloudinary = require('cloudinary').v2;
const BCRYPT_WORK_FACTOR = +process.env.BCRYPT_WORK_FACTOR;

class User {

  /** Authenticate user with username and password. 
      Returns { id, username, first_name, last_name, email } 
      Throws UnauthorizedError if user not found or wrong credentials.
  */
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

  /** Register user with data. 
      Returns { id, username, first_name, last_name, email } 
      Throws BadRequestError on duplicate username.
  */

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

  /** Find all users.
      Returns [{ id, username, first_name, last_name, email }, ...]
  */
  static async findAll() {
    const result = await db.query(`
      SELECT id, username, first_name AS "firstName", last_name AS "lastName", email
      FROM users
      ORDER BY username`
    );

    return result.rows;
  }
  /** Given user id, return data about the user.
      Returns { id, username, first_name, last_name, email } 
      where budgets is { id, amount, category }
      and expenses is { id, amount. date, vendor, description, category }

      Throws NotFoundError if the user is not found.
  */
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

  /** Update user data.
      Allows for partial update; data can include:
       { firstName, lastName, username, email }
      Requires the user password to confirm changes. 
      Returns {id, username, first_name, last_name, email} 
      Throws NotFoundError if the user is not found and UnauthorizedError if an incorrect password is entered.
  */

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
  /** Delete the given user from the database; returns the username. */

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

  /** Find user by username.
      Returns { id, username, first_name, last_name, email } or null if not found.
  */
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
  // New route for uploading and updating profile picture
  static async updateProfilePic(userId, url, filename, id) {
    // Check if the user already has a profile picture
    const oldProfilePic = await db.query(
      `SELECT profile_pic_id FROM users WHERE id = $1`,
      [userId]
    );

    // If yes, delete the old one from cloudinary
    if (oldProfilePic.rows[0].profile_pic_id) {
      await cloudinary.uploader.destroy(oldProfilePic.rows[0].profile_pic_id);
    }

    // Update the profile picture data in the database
    const result = await db.query(
      `UPDATE users SET profile_pic_url = $1, profile_pic_filename = $2, profile_pic_id = $3 WHERE id = $4 RETURNING profile_pic_url, profile_pic_filename, profile_pic_id`,
      [url, filename, id, userId]
    );

    return result.rows[0];
  }

  // Delete the profile picture
  static async deleteProfilePic(userId) {
    // Get the profile picture data from the database
    const profilePic = await db.query(
      `SELECT profile_pic_id FROM users WHERE id = $1`,
      [userId]
    );

    // Delete the image from cloudinary by its public id
    await cloudinary.uploader.destroy(profilePic.rows[0].profile_pic_id);

    // Delete the profile picture data from the database
    await db.query(
      `UPDATE users SET profile_pic_url = NULL, profile_pic_filename = NULL, profile_pic_id = NULL WHERE id = $1 RETURNING profile_pic_url, profile_pic_filename, profile_pic_id`,
      [userId]
    );

    return { message: 'Profile picture deleted successfully' };
  }
}

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

module.exports = User;