const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const Service = require('./services/user');

require('dotenv').config();
require('./config/db');

app.use(bodyParser.json());
app.use(cors());
// User verification.
app.post('/signin', Service.signin);
// User login and registration.
app.post('/signup', Service.signup);
// Response time on google.
app.get('/latency', Service.latency);
// User information.
app.get('/info', Service.userInfo);
// The user deletion function is not implemented.
app.get('/logout/:all', Service.logout);

app.listen(80, function () {
  console.log('CORS-enabled web server listening on port 80')
});
