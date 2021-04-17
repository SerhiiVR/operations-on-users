const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  idType: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now
  },
});