const mongoose = require('mongoose'),
  { Schema } = mongoose;

  const stockSchema = new Schema({
  name: {
    type: String,
  },
  amount: {
    type: Number,   
  },
  price: {
    type: Number,
  }
  });

  module.exports = mongoose.model("Stock", stockSchema);