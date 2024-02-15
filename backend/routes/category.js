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

router.get("/:categoryId/expenses", authenticateJWT, async function (req, res, next) {
    try {
        const userId = req.user.id;
        const categoryId = parseInt(req.params.categoryId);
        if (isNaN(categoryId)) {
          throw new BadRequestError("Category ID must be a number");
        }
        const expenses = await Category.getExpensesByCategory(userId, categoryId);
        
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
        const userId = parseInt(req.params.userId);
        const categoryId = parseInt(req.params.categoryId);
        if (isNaN(userId) || isNaN(categoryId)) {
          throw new BadRequestError("User ID and Category ID must be numbers");
        }
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
