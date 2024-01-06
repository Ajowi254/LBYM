// server.js
require('dotenv').config();
const app = require("./app");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const PORT = process.env.PORT || 3001;
app.set('io', io);
io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
  });

  // You can add more event listeners here
});

server.listen(PORT, function() {
  console.log(`Server started on PORT ${PORT}`);
  console.log(process.env.PLAID_CLIENT_ID, process.env.PLAID_SECRET, process.env.PLAID_ENVIRONMENT);
});

// Export the server and io to use them in other parts of the application
module.exports = { server, io };
