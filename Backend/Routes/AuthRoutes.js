import express from "express";
import { logoutUser } from "../controller/logoutController.js";
import AuthLogin from "../controller/AuthLoginController.js";
import authMiddleware from "../Midleware/authMiddleware.js";
import RegesterUserController from "../controller/RegisterUserController.js";
import VerifyCodeChecker from '../controller/verifycodeCheckerController.js';
import VerifyCodeSender from '../controller/VerificationcodeSender.js';
import { requestResetOtp, resetPassword, verifyResetOtp } from "../controller/auth.forgot.controller.js";

const router = express.Router();



router.post('/register', RegesterUserController);
router.post('/login', AuthLogin);


router.post('/logout', logoutUser);

router.post('/verify-code',VerifyCodeChecker);

router.post('/req-verify-code',VerifyCodeSender);

router.post("/forgot/request-otp", requestResetOtp);
router.post("/forgot/verify-otp", verifyResetOtp);

router.post("/forgot/reset-password", resetPassword);

router.get("/me", authMiddleware, (req, res) => {
  return res.json({
    success: true,

  });
});

export default router;
