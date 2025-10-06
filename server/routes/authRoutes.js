import { Router } from "express";
import { checkOtpAttempts, verifyToken } from "../middleware/auth.js";
import {
  login,
  sendOtp,
  signup,
  verifyOtp,
  getProfile,
} from "../controller/authController.js";
const router = Router();

router.post("/send-otp", checkOtpAttempts, sendOtp);
router.post("/verify-otp", checkOtpAttempts, verifyOtp);
router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", verifyToken, getProfile);
export default router;
