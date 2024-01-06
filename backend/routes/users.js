//users.js
/** Routes for users. */
const express = require("express");
const router = new express.Router();
const jsonschema = require("jsonschema");
const { parser } = require("../config"); // Import the parser

const User = require("../models/user");
const userUpdateSchema = require("../schemas/userUpdate.json");
const { BadRequestError } = require("../expressErrors");
const { ensureCorrectUser, authenticateJWT } = require('../middleware/auth');

/** GET /users/:userId => { user }
 * Returns { username, firstName, lastName, email, budgets, expenses}
 *   where budgets is { id, amount, category }
 *   and expenses is { id, amount. date, vendor, description, category }
 * Authorization required: same user as logged in user
 */

router.get("/:userId", authenticateJWT, ensureCorrectUser, async function (req, res, next) {
  try {
    const user = await User.get(req.params.userId);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /users/:userId { user } => { user }
 * Data can include: { username, firstName, lastName, email }
 * Returns { id, username, firstName, lastName, email }
 * Authorization required: same user as logged in user
 */

router.patch("/:userId", ensureCorrectUser, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const { password } = req.body;
    delete req.body.password;
    const user = await User.update(req.params.userId, password, req.body);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /users/:userId  =>  { deleted: username }
 * Authorization required: same user as logged in user
 */

router.delete("/:userId", ensureCorrectUser, async function (req, res, next) {
  try {
    const user = await User.remove(req.params.userId);
    return res.json({ deleted: user });
  } catch (err) {
    return next(err);
  }
});

// PATCH route to update user's profile picture
router.patch("/:userId/profile_pic", authenticateJWT, ensureCorrectUser, async function (req, res, next) {
  try {
    const userId = req.params.userId;
    const url = req.body.url; // Ensure this matches what you send from the frontend
    const user = await User.updateProfilePic(userId, url);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

// DELETE route to remove user's profile picture
router.delete("/:userId/profile_pic", authenticateJWT, ensureCorrectUser, async function (req, res, next) {
  try {
    await User.deleteProfilePic(req.params.userId);
    return res.json({ message: 'Profile picture deleted successfully' });
  } catch (err) {
    return next(err);
  }
});

router.get("/:userId/homepage", authenticateJWT, ensureCorrectUser, async function (req, res, next) {
  try {
    const homepageData = await User.getHomepageData(req.params.userId);
    return res.json(homepageData);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
