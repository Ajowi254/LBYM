//routes expense.js
const express = require("express");
const router = express.Router({ mergeParams: true });
const jsonschema = require("jsonschema");
const Expense = require("../models/expense");
const expenseNewSchema = require("../schemas/expenseNew.json");
const expenseUpdateSchema = require("../schemas/expenseUpdate.json");
const { BadRequestError } = require("../expressErrors");
const { ensureCorrectUser } = require('../middleware/auth');

router.get("/sum", ensureCorrectUser, async function (req, res, next) {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      throw new BadRequestError("User ID must be a number");
    }
    const expenses = await Expense.getSumByCategory(userId);
    
    if (expenses.length === 0) {
        return res.json({ expenses: [] });
    }

    return res.json({ expenses });
  } catch (err) {
    return next(err);
  }
});

router.get("/:expenseId", ensureCorrectUser, async function (req, res, next) {
  try {
    const userId = parseInt(req.params.userId);
    const expenseId = parseInt(req.params.expenseId);
    if (isNaN(userId) || isNaN(expenseId)) {
      throw new BadRequestError("User ID and Expense ID must be numbers");
    }
    const expense = await Expense.get(userId, expenseId);
    return res.json({ expense });

  } catch (err) {
    return next(err);
  }
})

router.get("/", ensureCorrectUser, async function (req, res, next) {
  try {
    const expenses = await Expense.findAll(req.params.userId);
    return res.json({ expenses });

  } catch (err) {
    return next(err);
  }
})

router.post("/", ensureCorrectUser, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, expenseNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const { userId } = req.params;
    const newExpense = await Expense.create(userId, req.body);

    // Fetch all expenses again after the update
    const updatedExpenses = await Expense.getSumByCategory(userId);

    // Emit the expenses_updated event with all expenses
    const io = req.app.get('io');
    io.emit('expenses_updated', { userId, expenses: updatedExpenses });

    return res.status(201).json({ expense: newExpense });
  } catch (err) {
    return next(err);
  }
});


router.patch("/:expenseId", ensureCorrectUser, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, expenseUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const { userId, expenseId } = req.params;
    const updatedExpense = await Expense.update(userId, expenseId, req.body);

    // Emit the expenses_updated event
    const io = req.app.get('io');
    io.emit('expenses_updated', { userId, expenses: [updatedExpense] });

    return res.json({ expense: updatedExpense });
  } catch(err) {
    return next(err);
  }
});

router.delete("/:expenseId", ensureCorrectUser, async function (req, res, next) {
  try {
    const { userId, expenseId } = req.params;
    await Expense.remove(userId, expenseId);
    return res.json({ deleted: expenseId });
    
  } catch (err) {
    return next(err);
  }
})
  
module.exports = router;