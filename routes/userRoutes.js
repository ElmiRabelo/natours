const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

//password
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);

// protects routes
router.use(authController.protect);

router.patch('/update-password', authController.updatePassword);

//user
router.get('/me', userController.getMe, userController.getUser);
router.patch('/update-me', userController.updateMe);
router.patch('/delete-me', userController.deleteMe);

router.use(authController.restrictTo('/admin'));

router.route('/').get(userController.getAllUsers);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
