import Response from "../models/Response.js";
import Doubt from "../models/Doubt.js";
import User from "../models/User.js";

export const createResponse = async (req, res) => {
  try {
    const { doubtId, response } = req.body;
    const userId = req.user.id || req.user._id;

    if (!response || !response.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Response content is required" });
    }

    if (!doubtId) {
      return res
        .status(400)
        .json({ success: false, message: "Doubt ID is required" });
    }

    // Check if doubt exists
    const doubt = await Doubt.findById(doubtId);
    if (!doubt) {
      return res
        .status(404)
        .json({ success: false, message: "Doubt not found" });
    }

    // Create new response
    const newResponse = await Response.create({
      user: userId,
      doubt: doubtId,
      response: response.trim(),
    });

    // Update the doubt's responses array
    await Doubt.findByIdAndUpdate(doubtId, {
      $push: { responses: newResponse._id },
    });

    // Update the user's responses array
    await User.findByIdAndUpdate(userId, {
      $push: { responses: newResponse._id },
    });

    // Populate the response with user info
    const populatedResponse = await Response.findById(newResponse._id).populate(
      "user",
      "name email userType"
    );

    return res.status(201).json({
      success: true,
      message: "Response posted successfully",
      response: populatedResponse,
    });
  } catch (e) {
    console.error("Error creating response:", e);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: e.message,
    });
  }
};

export const likeResponse = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user._id;

    const response = await Response.findById(id);
    if (!response) {
      return res
        .status(404)
        .json({ success: false, message: "Response not found" });
    }

    // Toggle like
    const likeIndex = response.likes.indexOf(userId);
    if (likeIndex > -1) {
      response.likes.splice(likeIndex, 1);
    } else {
      response.likes.push(userId);
    }

    await response.save();

    return res.status(200).json({
      success: true,
      message: "Like toggled successfully",
      likes: response.likes.length,
    });
  } catch (e) {
    console.error("Error liking response:", e);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
