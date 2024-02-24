//models-Notification.js
const db = require("../db");
var admin = require("../firebase.js"); // import the Firebase Admin SDK instance

class Notification {
  static async create({ userId, message, type }) {
    const result = await db.query(
      `INSERT INTO notifications (user_id, message, type)
       VALUES ($1, $2, $3)
       RETURNING id, user_id, message, type, is_read, created_at`,
      [userId, message, type]
    );
    
    // Prepare a message for FCM
    var fcmMessage = {
      notification: {
        title: 'New notification',
        body: message
      },
      topic: `user_${userId}`  // assuming each user subscribes to their own unique topic
    };

    // Send a message to devices subscribed to the provided topic.
    admin.messaging().send(fcmMessage)
      .then((response) => {
        // Response is a message ID string.
        console.log('Successfully sent message:', response);
      })
      .catch((error) => {
        console.log('Error sending message:', error);
      });

    return result.rows[0];
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;  // re-throw the error to be handled by the caller
  }

  
  static async findAllForUser(userId) {
    const result = await db.query(
      `SELECT id, user_id, message, type, is_read, created_at
       FROM notifications
       WHERE user_id = $1`,
      [userId]
    );
    return result.rows;
  }

  static async markAsRead(id) {
    const result = await db.query(
      `UPDATE notifications
       SET is_read = true
       WHERE id = $1
       RETURNING id, user_id, message, type, is_read, created_at`,
      [id]
    );
    return result.rows[0];
  }

static async findAllNew(userId) {
  const result = await db.query(
    `SELECT id, user_id, message, type, is_read, created_at
    FROM notifications
    WHERE user_id = $1 AND is_read = false
    ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
}

static async findByUserIdAndMessage(userId, message) {
  const result = await db.query(
    `SELECT * FROM notifications WHERE user_id = $1 AND message = $2`,
    [userId, message]
  );
  return result.rows[0];
}

}

module.exports = Notification;
