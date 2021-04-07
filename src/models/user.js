const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
  user_id: {
    type: String,
    default: 'did not specify'
  },
  password: {
    type: String,
    default: 'did not specify'
  },
  id_type: {
    type: String,
    default: 'did not specify'
  },
  date: {
    type: Date,
    default: Date.now
  },
});