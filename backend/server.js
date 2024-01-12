// server.js
require('dotenv').config();
const app = require("./app");
const http = require("http");
const cors = require('cors');
const { Server } = require("socket.io");

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

server.listen(PORT, function() {
  console.log(`Server started on PORT ${PORT}`);
  console.log(process.env.PLAID_CLIENT_ID, process.env.PLAID_SECRET, process.env.PLAID_ENVIRONMENT);
});

module.exports = { server, io };
