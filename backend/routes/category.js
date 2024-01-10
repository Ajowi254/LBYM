// routes-category.js
const express = require("express");
const router = express.Router();
const Category = require("../models/category");
const { authenticateJWT } = require('../middleware/auth');

// Get all categories (not user-specific)
router.get('/', async function (req, res, next) {
    try {
        const categories = await Category.getAll();
        return res.json({ categories });
    } catch (err) {
        next(err);
    }
});

// Get expenses for a specific category for the logged-in user
router.get("/:categoryId/expenses", authenticateJWT, async function (req, res, next) {
    try {
        const userId = req.user.id;
        const categoryId = req.params.categoryId;
        const expenses = await Category.getExpensesByCategory(userId, categoryId);
        
        // Handle the case where there are no expenses
        if (!expenses || expenses.length === 0) {
            return res.json({ expenses: [] });
        }
        
        return res.json({ expenses });
    } catch (err) {
        return next(err);
    }
});

// Get expenses by category for the logged-in user
router.get("/expenses", authenticateJWT, async function (req, res, next) {
    try {
        const userId = req.user.id;
        const expensesByCategory = await Category.getExpensesByCategory(userId);
        return res.json({ expensesByCategory });
    } catch (err) {
        return next(err);
    }
});

router.get("/over-budget", authenticateJWT, async function (req, res, next) {
    try {
        const categories = await Category.getAll();
        const overBudgetCategories = categories.filter(c => c.is_over_budget);
        return res.json({ overBudgetCategories });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
