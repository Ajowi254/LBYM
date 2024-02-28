// server.js
require('dotenv').config();
const app = require("./app");
var db = require("./db.js"); // require the db.js file

const http = require("http");
const cors = require('cors');
const { Server } = require("socket.io");

// Import node-cron and Budget model
const cron = require("node-cron");
const Budget = require("./models/budget");
const User = require("./models/user");
const Expense = require("./models/expense");

const PORT = process.env.PORT || 3001;

// Apply general CORS for REST API
app.use(cors({ origin: 'http://localhost:3000' }));

const server = http.createServer(app);

// Configure CORS for Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Your frontend origin
    methods: ['GET', 'POST'], // Allowed methods for Socket.IO
  },
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);


  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
  });

  // Additional event listeners...
});

// Define and schedule a job that runs every day at 8 AM
cron.schedule("0 8 * * *", async function() {
  // Get all users from the database
  const users = await User.findAll();

  // Loop through each user and calculate their remaining budget
  for (let user of users) {
    await Budget.calculateRemainingBudget(user.id);
  }
});

// Listen for database events
db.on("notification", async function(data) {
  // Check if the event is related to expenses
  if (data.channel === "expenses") {
    // Parse the event payload
    const payload = JSON.parse(data.payload);

    // Get the user id and the action from the payload
    const userId = payload.user_id;
    const action = payload.action;

    // Check if the action is insert or update
    if (action === "insert" || action === "update") {
      // Get the sum of expenses by category for the user
      const expenses = await Expense.getSumByCategory(userId);

      // Send the expenses to the Socket.IO clients
      io.to(`user_${userId}`).emit("expenses", expenses);
    }
  }
});

server.listen(PORT, function() {
  console.log(`Server started on PORT ${PORT}`);
  console.log(process.env.PLAID_CLIENT_ID, process.env.PLAID_SECRET, process.env.PLAID_ENVIRONMENT);
});

module.exports = { server, io };