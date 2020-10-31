const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
  body: {
    type: String,
    required: true,
    trim: true
  },
  owner: {
    type: String,
    unique: true,
    required: true
  },
  rate: {
    type: Number,
    required: true
  }
});

module.exports = model('Review', schema);