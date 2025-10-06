import otp from "../models/otp.js";
import jwt from "jsonwebtoken";

export const checkOtpAttempts = async (req, res, next) => {
  try {
    const { email } = req.body;
    const otpRecord = await otp.findOne({ email });
    // console.log("OTP Record: ", otpRecord);
    if (
      otpRecord?.blockedUntil &&
      otpRecord.blockedUntil > new Date(Date.now() + 1000)
    ) {
      const time = otpRecord.blockedUntil
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      return res.status(403).json({
        message: `Your account is blocked. Try again after ${time}`,
        success: false,
      });
    }
    if (
      otpRecord &&
      otpRecord.blockedUntil &&
      otpRecord.blockedUntil < new Date(Date.now() + 1000)
    ) {
      await otp.findByIdAndUpdate(otpRecord._id, {
        attempts: 0,
        blockedUntil: null,
      });
    }
    next();
  } catch (e) {
    console.error("Error in checkOtpAttempts middleware:", e);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const verifyToken = async (req, res, next) => {
  try {
    // Check for token in Authorization header or body
    let token = req.headers.authorization;
    if (token && token.startsWith("Bearer ")) {
      token = token.slice(7); // Remove 'Bearer ' prefix
    } else if (req.body.token) {
      token = req.body.token;
    }

    if (!token) {
      return res.status(401).json({
        message: "Token is required",
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }

    req.user = decoded;
    next();
  } catch (e) {
    console.error("Token verification error:", e);
    return res.status(401).json({
      message: "Unauthorized",
      success: false,
    });
  }
};
