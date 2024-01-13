//app.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { authenticateJWT } = require("./middleware/auth");
const { NotFoundError } = require("./expressErrors");

// Import routes
const authRoutes = require("./routes/auth");
const plaidRoutes = require("./routes/plaid");
const categoryRoutes = require("./routes/category");
const usersRoutes = require("./routes/users");
const expensesRoutes = require("./routes/expenses");
const accountsRoutes = require("./routes/accounts");
const budgetsRoutes = require("./routes/budget");
const goalsRoutes = require("./routes/goals");

const app = express();

// Apply middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authenticateJWT);

// Use routes
app.use("/auth", authRoutes);
app.use("/plaid", plaidRoutes);
app.use("/categories", categoryRoutes);

// Nested routes should be defined before their general counterparts
app.use("/users/:userId/accounts", accountsRoutes);
app.use("/users/:userId/budgets", budgetsRoutes);
app.use("/users/:userId/expenses", expensesRoutes);
app.use("/users/:userId/goals", goalsRoutes);
// General users route comes after the more specific nested routes
app.use("/users", usersRoutes);

// Catch-all for not found errors
app.use((req, res, next) => next(new NotFoundError()));

// Error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  return res.status(status).json({ error: { message: err.message, status } });
});

module.exports = app;
