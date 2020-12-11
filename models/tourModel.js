const { Schema, model } = require('mongoose');
const slugify = require('slugify');

const tourSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name must have a value'],
      trim: true,
      unique: true
    },
    slug: {
      type: String,
      trim: true,
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
    },
    summary: {
      type: String,
      require: [true, 'Tour must have a summery'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'Tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// add a virtual propertie called durationWeeks everytime to every get method
tourSchema.virtual('durationWeeks').get(function() {
  return Math.round(this.duration / 7);
});

// DOCUMENT MIDDLEWARE - mongoose middleware, pre or post hooks
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// QUERY MIDDLEWARE - this keyword refers to the query, not the object
tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = model('Tour', tourSchema);

module.exports = Tour;
