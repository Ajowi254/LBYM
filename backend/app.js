//app.js
const express = require("express");
const cors = require("cors");

require("dotenv").config();

const { authenticateJWT } = require("./middleware/auth");
const { NotFoundError } = require("./expressErrors");
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const expensesRoutes = require("./routes/expenses");
const goalsRoutes = require("./routes/goals"); 
const accountsRoutes = require("./routes/accounts"); 
const plaidRoutes = require("./routes/plaid");
const categoryRoutes = require("./routes/category"); // Import category routes

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authenticateJWT);
// Attach Socket.IO to every request (assuming io is passed from server.js)
app.use((req, res, next) => {
  req.io = req.app.get('io');
  next();
});

app.use("/auth", authRoutes);
app.use("/plaid", plaidRoutes);
app.use("/users", usersRoutes);
app.use("/users/:userId/expenses", expensesRoutes);
app.use("/users/:userId/goals", goalsRoutes);
app.use("/users/:userId/accounts", accountsRoutes); 
app.use("/categories", categoryRoutes); // Add category routes to the app

// Handle 404 errors
app.use((req, res, next) => next(new NotFoundError()));

// Generic error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  return res.status(status).json({ error: { message: err.message, status } });
});

module.exports = app;
