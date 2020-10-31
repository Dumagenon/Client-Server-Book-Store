const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
  product: {
    type: Types.ObjectId,
    ref: 'Book'
  },
  customer: {
    type: Types.ObjectId,
    ref: 'User'
  },
  count: {
    type: Number,
    required: true,
    default: 1
  }
});

module.exports = model('Order', schema);