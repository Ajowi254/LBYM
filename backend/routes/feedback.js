// backend/routes/feedback.js

const express = require('express');
const router = express.Router();
const db = require('../db'); // Adjust the path based on your structure

// POST endpoint to handle feedback submissions
router.post('/', async (req, res, next) => {
    try {
      const { userId, selectedOption } = req.body;
      const feedback = await Feedback.create(userId, selectedOption);
      res.status(201).json({ feedback });
    } catch (err) {
      next(err);
    }
  });

module.exports = router;