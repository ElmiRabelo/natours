const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      maxlength: [300, 'Review must have a maximum of 300 characters'],
      trim: true,
      required: [true, 'Must have a description']
    },
    rating: {
      type: Number,
      required: true,
      max: [5, 'The maximum value to a review is 5'],
      min: [1, 'The minimum value to a review is 1']
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Must belong to a user']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// reviewSchema.pre('save', function(next) {});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
