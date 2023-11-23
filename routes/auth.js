//auth.js
const bcrypt = require('bcrypt');
/** Routes for authentication. */
const jwt = require("jsonwebtoken")
const express = require("express");
const router = new express.Router();
const jsonschema = require("jsonschema");

const User = require("../models/user");
const userRegisterSchema = require("../schemas/userRegister.json");
const userAuthSchema = require("../schemas/userAuth.json");
const { createToken } = require("../helpers/token");
const { BadRequestError } = require("../expressErrors");

/** POST /auth/register:   { data } => { user, token }
 * data must include { username, password, firstName, lastName, email }
 * Returns user and JWT token which can be used to authenticate further requests.
 */

router.post("/register", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userRegisterSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.register({ ...req.body, password: hashedPassword });
    const token = createToken(user);
    return res.status(201).json({ token });
  } catch (err) {
    return next(err);
  }
});

router.post("/login", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userAuthSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const user = await User.authenticate(req.body.username, req.body.password);
    
    if (user) {
      const token = createToken(user);
      return res.json({ token });
    }

    throw new UnauthorizedError("Invalid username/password");
  } catch (err) {
    return next(err);
  }
});

module.exports = router;