const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

// mergeParams allows reviewRouter to have access to the params on tourRoutes that uses reviewRouter
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(authController.protect, reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  );

router.route('/:id').get(authController.protect, reviewController.getReview);

module.exports = router;
