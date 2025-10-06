import Doubt from "../models/Doubt.js";
import User from "../models/User.js";
import Tag from "../models/Tag.js";
import Response from "../models/Response.js";

// Helper function to handle tags
const handleTags = async (tagNames) => {
  const tagIds = [];
  for (const tagName of tagNames) {
    let existingTag = await Tag.findOne({ name: tagName });
    if (existingTag) {
      tagIds.push(existingTag._id);
    } else {
      const newTag = await Tag.create({
        name: tagName,
        discussions: [],
        doubts: [],
      });
      tagIds.push(newTag._id);
    }
  }
  return tagIds;
};

// Helper function to format time
const formatTimeAgo = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return date.toLocaleDateString();
};

export const getAllDoubts = async (req, res) => {
  try {
    const doubts = await Doubt.find({ isActive: true })
      .populate({ path: "user", select: "name email userType" })
      .populate({ path: "tags", select: "name" })
      .populate({
        path: "responses",
        populate: { path: "user", select: "name email userType" },
      })
      .sort({ createdAt: -1 });

    const formattedDoubts = doubts.map((doubt) => ({
      id: doubt._id,
      question: doubt.question,
      tags: doubt.tags.map((tag) => tag.name),
      author: doubt.user.name,
      isExpert: doubt.user.userType === "philosopher",
      dateTime: formatTimeAgo(doubt.createdAt),
      answers: doubt.responses.map((response) => ({
        id: response._id,
        author: response.user.name,
        content: response.response,
        dateTime: formatTimeAgo(response.createdAt),
        verified: response.user.userType === "philosopher",
      })),
      likeCount: doubt.likes ? doubt.likes.length : 0,
    }));

    return res.status(200).json({ success: true, doubts: formattedDoubts });
  } catch (e) {
    console.error("Error fetching all doubts:", e);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getDoubtById = async (req, res) => {
  try {
    const { id } = req.params;
    const doubt = await Doubt.findById(id)
      .populate({
        path: "user",
        select: "name profilePicture",
      })
      .populate({
        path: "tags",
        select: "name",
      })
      .populate({
        path: "responses",
        populate: {
          path: "user",
          select: "name profilePicture",
        },
      });
    if (!doubt) {
      return res.status(404).json({
        success: false,
        message: "Doubt not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Doubt fetched successfully",
      doubt,
    });
  } catch (e) {
    console.error("Error fetching doubt by ID:", e);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const createDoubt = async (req, res) => {
  try {
    const { question, tags } = req.body;
    const userId = req.user.id || req.user._id;

    if (!question || !question.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Question is required" });
    }

    let tagIds = [];
    if (tags && tags.length > 0) {
      tagIds = await handleTags(tags);
    }

    const newDoubt = await Doubt.create({
      user: userId,
      question: question.trim(),
      tags: tagIds,
    });

    await User.findByIdAndUpdate(userId, { $push: { doubts: newDoubt._id } });

    if (tagIds.length > 0) {
      await Tag.updateMany(
        { _id: { $in: tagIds } },
        { $push: { doubts: newDoubt._id } }
      );
    }

    const populatedDoubt = await Doubt.findById(newDoubt._id)
      .populate("user", "name email")
      .populate("tags", "name");

    return res.status(201).json({
      success: true,
      message: "Question posted successfully",
      doubt: populatedDoubt,
    });
  } catch (e) {
    console.error("Error creating doubt:", e);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: e.message,
    });
  }
};

export const activateDoubt = async (req, res) => {
  try {
    const { id } = req.params;
    const doubt = await Doubt.findById(id);
    if (!doubt) {
      return res.status(404).json({
        success: false,
        message: "Doubt not found",
      });
    }
    doubt.isActive = true;
    await doubt.save();
    return res.status(200).json({
      success: true,
      message: "Doubt activated successfully",
      doubt,
    });
  } catch (e) {
    console.error("Error activating doubt:", e);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const deactivateDoubt = async (req, res) => {
  try {
    const { id } = req.params;
    const doubt = await Doubt.findById(id);
    if (!doubt) {
      return res.status(404).json({
        success: false,
        message: "Doubt not found",
      });
    }
    doubt.isActive = false;
    await doubt.save();
    return res.status(200).json({
      success: true,
      message: "Doubt deactivated successfully",
      doubt,
    });
  } catch (e) {
    console.error("Error deactivating doubt:", e);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const likeDoubt = async (req, res) => {
  try {
    const { id: doubtId } = req.params;
    if (!doubtId) {
      return res.status(400).json({
        success: false,
        message: "Invalid URL",
      });
    }
    const doubt = await Doubt.findById(doubtId);
    if (!doubt) {
      return res.status(404).json({
        success: false,
        message: "Doubt not found",
      });
    }
    const { id: userId } = req.user;
    if (!doubt.likes.includes(userId)) {
      doubt.likes.push(userId);
    }
    await doubt.save();
    return res.status(200).json({
      liked: true,
      success: true,
      message: "Doubt liked successfully",
      likesCount: doubt.likes.length,
    });
  } catch (e) {
    console.error("Error liking doubt:", e);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const dislikeDoubt = async (req, res) => {
  try {
    const { id: doubtId } = req.params;
    if (!doubtId) {
      return res.status(400).json({
        success: false,
        message: "Invalid URL",
      });
    }
    const doubt = await Doubt.findById(doubtId);
    if (!doubt) {
      return res.status(404).json({
        success: false,
        message: "Doubt not found",
      });
    }
    const { id: userId } = req.user;
    const index = doubt.likes.indexOf(userId);
    if (index !== -1) {
      doubt.likes.splice(index, 1);
    }
    await doubt.save();
    return res.status(200).json({
      liked: false,
      success: true,
      message: "Doubt disliked successfully",
      likesCount: doubt.likes.length,
    });
  } catch (e) {
    console.error("Error disliking doubt:", e);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
