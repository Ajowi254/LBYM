//budget.js
const express = require("express");
const router = express.Router();
const { ensureCorrectUser } = require('../middleware/auth');
const jsonschema = require("jsonschema");
const budgetSetSchema = require("../schemas/budgetSet.json");
const budgetGetSchema = require("../schemas/budgetGet.json");
const Budget = require("../models/budget");
const { BadRequestError } = require("../expressErrors");

// Set budget limit for a category
router.post("/users/:userId/budgets", ensureCorrectUser, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, budgetSetSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const userId = req.params.userId;
    const { categoryId, budgetLimit } = req.body;
    const budget = await Budget.setBudget(userId, categoryId, budgetLimit);
    return res.status(201).json({ budget });
  } catch (err) {
    return next(err);
  }
});

// Get all budget limits for a user
router.get("/users/:userId/budgets", ensureCorrectUser, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.params, budgetGetSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const userId = req.params.userId; // Ensuring we're using the userId from the route param
    const budgets = await Budget.getBudgets(userId);
    return res.json({ budgets });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
