// server.js
require('dotenv').config();
const app = require("./app");

const PORT = process.env.PORT || 3001;

app.listen(PORT, function() {
  console.log(`Server started on PORT ${PORT}`);
  console.log(process.env.PLAID_CLIENT_ID, process.env.PLAID_SECRET, process.env.PLAID_ENVIRONMENT);
});