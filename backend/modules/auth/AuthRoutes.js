const express = require('express');
const AuthRouter = express.Router();
const { protectRoute } = require('../../middlewares/AuthMiddleware');
const authController = require('./AuthController');

AuthRouter.post('/register', authController.createUser);
AuthRouter.post('/login', authController.loginUser);
AuthRouter.post('/logout', protectRoute, authController.logoutUser);
AuthRouter.post('/forgot-password', authController.forgotPassword);
AuthRouter.post('/reset-password', authController.resetPassword);
AuthRouter.post('/verify-email', protectRoute,  authController.startEmailVerification);
AuthRouter.post('/verify-email/:token', authController.verifyEmail);
AuthRouter.delete('/:userId', protectRoute, authController.deleteUser);

module.exports = AuthRouter;
