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

// GET /users/:userId/total-expenses
router.get("/users/:userId/total-expenses", authenticateJWT, async function (req, res, next) {
    try {
        const userId = req.params.userId;
        let totalExpenses = await Category.getTotalExpensesByCategory(userId);

        // Check if totalExpenses is not null or undefined
        if (!totalExpenses) {
            // If no expenses found, initialize totalExpenses to an empty object
            totalExpenses = {};
        }

        return res.json({ totalExpenses });
    } catch (err) {
        // Log the error and return an empty object to indicate no expenses
        console.error(err);
        return res.json({ totalExpenses: {} });
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
// Add this route in your routes-category.js file
router.get('/users/:userId/categories/:categoryId/expenses', authenticateJWT, async function (req, res, next) {
    try {
        const userId = req.params.userId;
        const categoryId = req.params.categoryId;
        const expenses = await Category.getExpensesByCategory(userId, categoryId);
        
        if (!expenses) {
            return res.status(404).json({ message: "No expenses found for this category" });
        }

        return res.json({ expenses });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
