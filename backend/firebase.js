//FIREBASE.JS
var admin = require("firebase-admin");

var serviceAccount = require("./lbym-7a60a-2e74e1b83a3f.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
