//auth.js
/** Middleware for handling req authorization for routes. */

const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET_KEY;
const { UnauthorizedError } = require("../expressErrors");

/** Middleware: Authenticate user and store current user on res.locals. */

// Inside authenticateJWT middleware
function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers && req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      const payload = jwt.verify(token, SECRET_KEY);
      console.log("Decoded Payload:", payload); // Log the decoded payload
      res.locals.user = payload;
    }
    return next();
  } catch (err) {
    return next();
  }
}
/** Middleware: Check for valid token and match user with route param. If not, raise UnauthorizedError. */

function ensureCorrectUser(req, res, next) {
  try {
    const user = res.locals.user;
    if (!(user && (user.id === +req.params.userId))) throw new UnauthorizedError();
    return next();
  } catch (err) {
    return next(err);
  }
}


module.exports = {
  authenticateJWT,
  ensureCorrectUser
}