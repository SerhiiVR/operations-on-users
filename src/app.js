require('dotenv').config();
require('./config/db');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const UserService = require('./controllers/user');
const LatencyService = require('./controllers/latency');

app.use(bodyParser.json());
app.use(cors());
// User verification.
app.post('/signin', UserService.signin);
// User login and registration.
app.post('/signup', UserService.signup);
// Response time on google.
app.get('/latency', LatencyService.latency);
// User information.
app.get('/info', UserService.userInfo);
// The user deletion function is not implemented.
app.get('/logout/:all', UserService.logout);

app.listen(80, function () {
  console.log('CORS-enabled web server listening on port 80')
});
