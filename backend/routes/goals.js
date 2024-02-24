//goals.js
const express = require("express");
const router = express.Router({ mergeParams: true });
const Goal = require("../models/goal");
const { BadRequestError } = require("../expressErrors");
const { ensureCorrectUser } = require('../middleware/auth');
const jsonschema = require("jsonschema");
const goalCreateSchema = require("../schemas/goalCreate.json");
const goalUpdateSchema = require("../schemas/goalUpdate.json");

// POST route to create a new goal
router.post("/", ensureCorrectUser, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, goalCreateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const { userId } = req.params;
    const goal = await Goal.create({ ...req.body, user_id: userId });
    return res.status(201).json({ goal });
  } catch (err) {
    return next(err);
  }
});

router.get("/", ensureCorrectUser, async function (req, res, next) {
  try {
    const { userId } = req.params;
    const goals = await Goal.findAllForUser(userId);
    return res.json({ goals: goals.length > 0 ? goals : [] });
  } catch (err) {
    return next(err);
  }
});

// New route to get the total budget for each category
router.get("/budget", ensureCorrectUser, async function (req, res, next) {
  try {
    const { userId } = req.params;
    const budgets = await Goal.getBudgetByCategory(userId);
    return res.json({ budgets: budgets.length > 0 ? budgets : [] });
  } catch (err) {
    return next(err);
  }
});

router.patch("/:goalId", ensureCorrectUser, async function (req, res, next) {
  try {
    const { goalId } = req.params;
    const goal = await Goal.update(goalId, req.body);
    return res.json({ goal });
  } catch (err) {
    return next(err);
  }
});

router.delete("/:goalId", ensureCorrectUser, async function (req, res, next) {
  try {
    const { goalId } = req.params;
    await Goal.remove(goalId);
    return res.json({ deleted: goalId });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
