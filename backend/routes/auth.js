const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/verify-otp", authController.verifyOtp);
router.post("/login", authController.login);
router.post("/resend-otp", authController.resendOtp);

// Admin Routes
router.post("/admin/register", authController.registerAdmin);
router.post("/admin/verify", authController.verifyAdminOtp);
router.post("/admin/login", authController.adminLogin);
router.post("/admin/resend-otp", authController.resendAdminOtp);

// Kitchen Routes
router.post("/kitchen/register", authController.registerKitchen);
router.post("/kitchen/verify", authController.verifyKitchenOtp);
router.post("/kitchen/login", authController.kitchenLogin);
router.post("/kitchen/resend-otp", authController.resendKitchenOtp);

// Forgot Password Routes
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-reset-otp", authController.verifyResetOtp);
router.post("/reset-password", authController.resetPassword);

// Recover Code Route
router.post("/recover-code", authController.recoverCode);

// Diagnostic Routes
router.get("/hello", authController.helloTest);
router.get("/test-email", authController.testEmail);

module.exports = router;
