const { Schema, model } = require('mongoose');

const tourSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name must have a value'],
    unique: true
  },
  duration: {
    type: Number,
    required: [true, 'Tour must have a duration']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'Tour must have a group size']
  },
  difficulty: {
    type: String
  },
  ratingsAverage: {
    type: Number,
    default: 4.5
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'Tour must have a price']
  }
});

const Tour = model('Tour', tourSchema);

module.exports = Tour;
