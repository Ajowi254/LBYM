// routes-category.js
const express = require("express");
const router = express.Router();
const Category = require("../models/category");
const { authenticateJWT } = require('../middleware/auth'); // Correctly import the middleware

// Get all categories (not user-specific)
router.get("/categories", authenticateJWT, async function (req, res, next) {
    try {
        const categories = await Category.getAll();
        return res.json({ categories });
    } catch (err) {
        return next(err);
    }
});

// Get expenses by category for the logged-in user
router.get("/expenses", authenticateJWT, async function (req, res, next) { // Assuming authenticateJWT should be used here
    try {
        const userId = req.user.id;
        const expensesByCategory = await Category.getExpensesByCategory(userId);
        return res.json({ expensesByCategory });
    } catch (err) {
        return next(err);
    }
});

router.get("/over-budget", authenticateJWT, async function (req, res, next) { // Assuming authenticateJWT should be used here
    try {
        const categories = await Category.getAll();
        const overBudgetCategories = categories.filter(c => c.is_over_budget);
        return res.json({ overBudgetCategories });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
