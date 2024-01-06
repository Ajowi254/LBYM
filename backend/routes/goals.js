// goals.js
const express = require("express");
const router = express.Router({ mergeParams: true });
const jsonschema = require("jsonschema");

const Goal = require("../models/goal");
const goalNewSchema = require("../schemas/goalNew.json");
const goalUpdateSchema = require("../schemas/goalUpdate.json");
const { BadRequestError } = require("../expressErrors");
const { ensureCorrectUser } = require('../middleware/auth');

// Retrieve a specific goal by its ID
router.get("/:goalId", ensureCorrectUser, async function (req, res, next) {
  try {
    const { userId, goalId } = req.params;
    const goal = await Goal.get(userId, goalId);
    return res.json({ goal });
  } catch (err) {
    return next(err);
  }
});

// Retrieve all goals for a specific user
router.get("/", ensureCorrectUser, async function (req, res, next) {
  try {
    const goals = await Goal.getAll(req.params.userId);
    return res.json({ goals });
  } catch (err) {
    return next(err);
  }
});

// Create a new goal
router.post("/", ensureCorrectUser, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, goalNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const goal = await Goal.create(req.params.userId, req.body);
    req.app.get('io').emit('goal_created', { goal, userId: req.params.userId });
    return res.status(201).json({ goal });
  } catch (err) {
    return next(err);
  }
});

// Update a specific goal
router.patch("/:goalId", ensureCorrectUser, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, goalUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const { userId, goalId } = req.params;
    const goal = await Goal.update(userId, goalId, req.body);
    req.app.get('io').emit('goal_updated', { goal, userId });
    return res.json({ goal });
  } catch (err) {
    return next(err);
  }
});

// Remove a specific goal
router.delete("/:goalId", ensureCorrectUser, async function (req, res, next) {
  try {
    const { userId, goalId } = req.params;
    await Goal.remove(userId, goalId);
    req.app.get('io').emit('goal_removed', { goalId, userId });
    return res.json({ deleted: goalId });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
