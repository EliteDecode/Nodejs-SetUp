const AuthRouter = require("express").Router();
const Authcontroller = require("./AuthController");

const authController = new Authcontroller();

AuthRouter.post("/register",authController.registerUser)
AuthRouter.post("/verify-email/:token",authController.verifyEmail)
AuthRouter.post("/resend-verification-code",authController.resendVerifyEmailCode)
AuthRouter.post("/login",authController.loginUser)
AuthRouter.post("/forgot-password",authController.forgotPassword)
AuthRouter.post("/verify-forgotPassword-code/:token",authController.verifyForgotPasswordCode)
AuthRouter.post("/resend-forgotPassword-code",authController.resendForgotPasswordOtp)
AuthRouter.post("/reset-password",authController.resetPassword)
// AuthRouter.post("/logout",authController.logout)

// protected routes
AuthRouter.post("/change-password",authController.changePassword)

module.exports = AuthRouter;