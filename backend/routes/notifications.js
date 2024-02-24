// routes=Notification.js
const express = require("express");
const router = express.Router({ mergeParams: true });
const { ensureCorrectUser } = require('../middleware/auth');
const Notification = require("../models/notification");

// GET /users/:userId/notifications
// Get all notifications for a given user
router.get('/', ensureCorrectUser, async function(req, res, next) {
  try {
    const { userId } = req.params;
    const notifications = await Notification.findAllForUser(userId);
    return res.json({ notifications });
  } catch (err) {
    return next(err);
  }
});

// PATCH /users/:userId/notifications/:id/read
// Mark a notification as read
router.patch('/:id/read', ensureCorrectUser, async function(req, res, next) {
  try {
    const { id } = req.params;
    const notification = await Notification.markAsRead(id);
    return res.json({ notification });
  } catch (err) {
    return next(err);
  }
});

router.get("/new", async function(req, res, next) {
  try {
    const userId = req.user.id; // assuming you have some middleware to get the current user
    const notifications = await Notification.findAllNew(userId);
    return res.json({ notifications });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
