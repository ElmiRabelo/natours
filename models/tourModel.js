const { Schema, model } = require('mongoose');

const tourSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name must have a value'],
    unique: true
  },
  duration: {
    type: Number
  },
  difficulty: {
    type: String
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true, 'Tour must have a price']
  }
});

const Tour = model('Tour', tourSchema);

module.exports = Tour;
