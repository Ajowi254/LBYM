const express = require("express");
const router = express.Router({ mergeParams: true });
const { ensureCorrectUser } = require('../middleware/auth');
const Budget = require("../models/budget");

// Set a new budget
router.post('/', ensureCorrectUser, async function(req, res, next) {
    try {
        const { userId } = req.params;
        const { categoryId, budgetLimit } = req.body;
        // Use the setBudget function to create a new budget entry
        const budget = await Budget.setBudget(userId, categoryId, budgetLimit);
        return res.status(201).json({ budget });
    } catch (err) {
        return next(err);
    }
});

// Update an existing budget
router.patch('/:categoryId', ensureCorrectUser, async function(req, res, next) {
    try {
        const { userId, categoryId } = req.params;
        const { budgetLimit } = req.body;
        // Use the updateBudget function to update an existing budget entry
        const budget = await Budget.updateBudget(userId, categoryId, budgetLimit);
        return res.status(200).json({ budget });
    } catch (err) {
        return next(err);
    }
});

// Get all budgets for a user
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
