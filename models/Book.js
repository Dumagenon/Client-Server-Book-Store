const { Schema, model } = require('mongoose');

const schema = new Schema({
  author: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  seller: {
    type: String,
    required: true
  }
});

module.exports = model('Book', schema);