// routes/budget.js
const express = require("express");
const router = express.Router({ mergeParams: true });
const { ensureCorrectUser } = require('../middleware/auth');
const Budget = require("../models/budget");

router.post('/', ensureCorrectUser, async function(req, res, next) {
  try {
    const { userId } = req.params;
    const { categoryId, budgetLimit } = req.body;
    const budget = await Budget.setOrUpdateBudget(userId, categoryId, budgetLimit);
    return res.status(201).json({ budget });
  } catch (err) {
    return next(err);
  }
});

router.get('/', ensureCorrectUser, async function(req, res, next) {
  try {
    const { userId } = req.params;
    const budgets = await Budget.getBudgets(userId);
    return res.json({ budgets });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
