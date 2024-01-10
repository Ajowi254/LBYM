//goals.js
const express = require("express");
const router = express.Router();
const Goal = require("../models/goal");
const { ensureCorrectUser } = require("../middleware/auth");
const jsonschema = require("jsonschema");
const goalCreateSchema = require("../schemas/goalCreate.json");
const goalUpdateSchema = require("../schemas/goalUpdate.json");

// POST route to create a new goal
router.post("/:userId/goals", ensureCorrectUser, async function (req, res, next) {
  const validator = jsonschema.validate(req.body, goalCreateSchema);
  if (!validator.valid) {
    return res.status(400).json({ error: validator.errors.map(e => e.stack) });
  }

  try {
    const { category_id, goal_amount, description } = req.body;
    const user_id = req.params.userId;
    const goal = await Goal.create({ user_id, category_id, goal_amount, description });
    return res.status(201).json({ goal });
  } catch (err) {
    return next(err);
  }
});

// GET route to retrieve all goals for a user
router.get("/:userId/goals", ensureCorrectUser, async function (req, res, next) {
  try {
    const user_id = req.params.userId;
    const goals = await Goal.findAllForUser(user_id);
    return res.json({ goals: goals || [] }); // Return an empty array if no goals found
  } catch (err) {
    return next(err);
  }
});

// PATCH route to update a specific goal
router.patch("/goals/:goalId", ensureCorrectUser, async function (req, res, next) {
  const validator = jsonschema.validate(req.body, goalUpdateSchema);
  if (!validator.valid) {
    return res.status(400).json({ error: validator.errors.map(e => e.stack) });
  }

  try {
    const goalId = req.params.goalId;
    const updatedGoal = await Goal.update(goalId, req.body);
    return res.json({ updatedGoal });
  } catch (err) {
    return next(err);
  }
});

// DELETE route to delete a specific goal
router.delete("/goals/:goalId", ensureCorrectUser, async function (req, res, next) {
  try {
    const goalId = req.params.goalId;
    const deletedGoal = await Goal.remove(goalId);
    return res.json({ deleted: deletedGoal.id });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
