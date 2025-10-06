import Otp from "../models/otp.js";
import bcrypt from "bcrypt";
import { otpMailOptions, transporter } from "../config/mailer.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
// const jwt = require("jsonwebtoken");
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }
    // Generate 6 digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const mailOptions = otpMailOptions(generatedOtp, email);

    // Hash OTP
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(generatedOtp, salt);

    // Set expiry 5 minutes from now
    const validUntil = new Date(Date.now() + 5 * 60 * 1000 + 5 * 1000);

    // Save new OTP
    let otpRecord = await Otp.findOne({ email });
    if (otpRecord) {
      console.log("OTP record found: ", otpRecord);
      await Otp.findByIdAndUpdate(otpRecord._id, {
        otp: hashedOtp,
        validUntil,
      });
    } else {
      otpRecord = await Otp.create({
        email,
        otp: hashedOtp,
        validUntil,
      });
    }
    // console.log("OTP record: ", otpRecord);
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        // console.error("Error sending email: ", err);
        return res.status(500).json({
          message: err.message || "Error sending email",
          success: false,
        });
      }
      // console.log("Email sent: ", info.response);
      return res.status(200).json({
        message: "OTP sent successfully",
        success: true,
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: error.message,
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    // Find OTP record
    // const allOtps = await Otp.find({});
    // console.log(allOtps);
    const otpRecord = await Otp.findOne({
      email,
    });
    // console.log(otpRecord);
    if (!otpRecord || otpRecord.validUntil < new Date(Date.now() + 2 * 1000)) {
      console.log("OTP expired or not found");
      return res.status(400).json({
        success: false,
        message: "OTP expired or not found",
      });
    }

    // Verify OTP
    const isValid = await bcrypt.compare(otp, otpRecord.otp);

    if (!isValid) {
      // Increment attempts
      const attempts = otpRecord.attempts + 1;

      if (attempts > 3) {
        // Block for 24 hours
        const blockedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await Otp.findByIdAndUpdate(otpRecord._id, {
          attempts,
          blockedUntil,
        });

        return res.status(403).json({
          success: false,
          message: "Maximum attempts exceeded. Account blocked for 24 hours",
        });
      }

      await Otp.findByIdAndUpdate(otpRecord._id, { attempts });

      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${3 - attempts} attempts remaining`,
      });
    }

    await Otp.findByIdAndDelete(otpRecord._id);
    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Verification failed",
      error: error.message,
    });
  }
};

export const signup = async (req, res) => {
  try {
    const { email, name, password, phone, userType, expertise, bio } = req.body;
    if (!email || !name || !password || !phone || !userType) {
      return res.status(400).json({
        message: "All required fields must be provided",
        success: false,
      });
    }

    // Validate userType
    if (!["philosopher", "normal"].includes(userType)) {
      return res.status(400).json({
        message: "Invalid user type",
        success: false,
      });
    }

    // Check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      email,
      name,
      password: hashedPassword,
      phone,
      userType,
    };

    // Add optional fields for philosophers
    if (userType === "philosopher") {
      if (expertise && Array.isArray(expertise)) {
        userData.expertise = expertise;
      }
      if (bio) {
        userData.bio = bio;
      }
    }

    const updUser = await User.create(userData);
    const token = jwt.sign(
      {
        id: updUser._id,
        userType: updUser.userType,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Determine redirect path based on user type
    const redirectTo =
      userType === "philosopher" ? "/philosopher-profile" : "/profile";

    return res.status(201).json({
      token,
      user: {
        id: updUser._id,
        name: updUser.name,
        email: updUser.email,
        userType: updUser.userType,
      },
      redirectTo,
      message: "User created successfully",
      success: true,
    });
  } catch (e) {
    console.error("Signup error:", e);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
        success: false,
      });
    }
    const token = jwt.sign(
      {
        id: user._id,
        userType: user.userType,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Determine redirect path based on user type
    const redirectTo =
      user.userType === "philosopher" ? "/philosopher-profile" : "/profile";

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
      },
      redirectTo,
      message: "Login successful",
      success: true,
    });
  } catch (e) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        userType: user.userType,
        expertise: user.expertise,
        bio: user.bio,
        createdAt: user.createdAt,
        doubts: user.doubts || [],
        responses: user.responses || [],
        discussions: user.discussions || [],
      },
      message: "Profile retrieved successfully",
      success: true,
    });
  } catch (e) {
    console.error("Error in getProfile:", e);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
