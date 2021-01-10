const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/catchAsync');
// const APIFeatures = require('./../utils/apiFeatures');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const reviews = await Review.find(filter);

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: reviews
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('Review not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: review
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const { review, rating } = req.body;

  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  const newReview = await Review.create({
    review,
    rating,
    tour: req.body.tour,
    user: req.body.user
  });

  res.status(201).json({
    status: 'success',
    data: newReview
  });
});
