const express = require("express");
const router = express.Router({ mergeParams: true });
const jsonschema = require("jsonschema");

const Expense = require("../models/expense");
const expenseNewSchema = require("../schemas/expenseNew.json");
const expenseUpdateSchema = require("../schemas/expenseUpdate.json");
const { BadRequestError } = require("../expressErrors");
const { ensureCorrectUser } = require('../middleware/auth');

// GET /users/:userId/expenses/sum => { expenses }
router.get("/sum", ensureCorrectUser, async function (req, res, next) {
  try {
    const expenses = await Expense.getSumByCategory(req.params.userId);
    
    // If there are no expenses, return an empty array
    if (expenses.length === 0) {
        return res.json({ expenses: [] });
    }

    return res.json({ expenses });
  } catch (err) {
    return next(err);
  }
});

// GET /users/:userId/expenses => { expenses }
router.get("/", ensureCorrectUser, async function (req, res, next) {
  try {
    const expenses = await Expense.findAll(req.params.userId);
    return res.json({ expenses });
  } catch (err) {
    return next(err);
  }
});

// GET /users/:userId/expenses/:expenseId => { expense }
router.get("/:expenseId", ensureCorrectUser, async function (req, res, next) {
  try {
    const { userId, expenseId } = req.params;
    const expense = await Expense.get(userId, expenseId);
    return res.json({ expense });
  } catch (err) {
    return next(err);
  }
});

// POST /users/:userId/expenses { expense } => { expense }
router.post("/", ensureCorrectUser, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, expenseNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const expense = await Expense.create(req.params.userId, req.body);
    req.io.emit('expense_created', { expense, user_id: req.params.userId }); // Emit WebSocket event

    return res.status(201).json({ expense });
  } catch (err) {
    return next(err);
  }
});

// PATCH /users/:userId/expenses/:expenseId { expense } => { expense }
router.patch("/:expenseId", ensureCorrectUser, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, expenseUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const expense = await Expense.update(req.params.userId, req.params.expenseId, req.body);
    req.io.emit('expense_updated', { expense, user_id: req.params.userId }); // Emit WebSocket event

    return res.json({ expense });
  } catch (err) {
    return next(err);
  }
});

// DELETE /users/:userId/expenses/:expenseId => { deleted: id }
router.delete("/:expenseId", ensureCorrectUser, async function (req, res, next) {
  try {
      const deletedExpense = await Expense.remove(req.params.userId, req.params.expenseId);
      if (!deletedExpense) {
          throw new NotFoundError(`Expense not found: ${req.params.expenseId}`);
      }
      req.io.emit('expense_removed', { expense_id: req.params.expenseId, user_id: req.params.userId });
      return res.json({ deleted: req.params.expenseId });
  } catch (err) {
      return next(err);
  }
});

module.exports = router;
