const { Schema, model } = require('mongoose');
const slugify = require('slugify');

const tourSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name must have a value'],
      trim: true,
      unique: true,
      maxlength: [50, 'A tour must have less or equal than 50 characters'],
      minlength: [8, 'A tour must have more or equal than 8 characters']
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
      type: String,
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message:
          'Must be one of the following values: easy, medium or difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1'],
      max: [5, 'Rating must be below 5']
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'Tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          // only run when create a new document
          return val < this.price;
        },
        message: 'Discoutn price ({VALUE}) must be below regular price'
      }
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
