import Content from "../models/Content.js";
import User from "../models/User.js";
import mongoose from "mongoose";

// Create new content (Philosophers only)
const createContent = async (req, res) => {
  try {
    console.log(
      "createContent called by user:",
      req.user?.id || req.user?._id,
      "userType:",
      req.user?.userType
    );
    console.log("Full req.user object:", req.user);
    const { title, description, fullContent, category, tags } = req.body;

    let userType = req.user.userType;

    // Fallback: if userType is not in token (old tokens), fetch from database
    if (!userType) {
      console.log("userType not in token, fetching from database...");
      const user = await User.findById(req.user.id || req.user._id);
      userType = user?.userType;
      console.log("Fetched userType from database:", userType);
    }

    // Check if user is a philosopher
    if (userType !== "philosopher") {
      return res.status(403).json({
        success: false,
        message: "Only philosophers can create content",
      });
    }

    // Calculate estimated read time (average 200 words per minute)
    const wordCount = fullContent.split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    const authorId = req.user.id || req.user._id;
    console.log("Using authorId for content creation:", authorId);

    const newContent = new Content({
      title,
      description,
      fullContent,
      category,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      author: authorId,
      readTime,
    });

    await newContent.save();
    await newContent.populate("author", "name email");

    res.status(201).json({
      success: true,
      message: "Content created successfully",
      content: newContent,
    });
  } catch (error) {
    console.error("Error creating content:", error);
    res.status(500).json({
      success: false,
      message: "Error creating content",
      error: error.message,
    });
  }
};

// Get all published content with pagination and filters
const getAllContent = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build filter object
    const filter = { status: "published" };

    if (category && category !== "all") {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const sortOptions = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    // Get content with pagination
    const content = await Content.find(filter)
      .populate("author", "name email")
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const totalContent = await Content.countDocuments(filter);
    const totalPages = Math.ceil(totalContent / limit);

    res.json({
      success: true,
      contents: content,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalContent,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching content:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching content",
      error: error.message,
    });
  }
};

// Get single content by ID
const getContentById = async (req, res) => {
  try {
    const { id } = req.params;

    const content = await Content.findById(id)
      .populate("author", "name email userType")
      .populate("comments.user", "name email")
      .lean();

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    res.json({
      success: true,
      content,
    });
  } catch (error) {
    console.error("Error fetching content:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching content",
      error: error.message,
    });
  }
};

// Get content by philosopher (for profile page)
const getMyContent = async (req, res) => {
  try {
    if (!req.user || (!req.user.id && !req.user._id)) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const userId = req.user.id || req.user._id;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Convert string ID to ObjectId if necessary
    const authorId = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    const contents = await Content.find({ author: authorId })
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const totalContent = await Content.countDocuments({ author: authorId });
    const totalPages = Math.ceil(totalContent / limit);

    res.json({
      success: true,
      contents,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalContent,
      },
    });
  } catch (error) {
    console.error("Error fetching user content:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching your content",
      error: error.message,
    });
  }
};

// Update content (author only)
const updateContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, fullContent, category, tags } = req.body;

    const content = await Content.findById(id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    // Check if user is the author
    const userId = req.user.id || req.user._id;

    if (content.author.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own content",
      });
    }

    // Calculate new read time
    if (fullContent) {
      const wordCount = fullContent.split(/\s+/).length;
      content.readTime = Math.max(1, Math.ceil(wordCount / 200));
    }

    // Update fields
    if (title) content.title = title;
    if (description) content.description = description;
    if (fullContent) content.fullContent = fullContent;
    if (category) content.category = category;
    if (tags) content.tags = tags.split(",").map((tag) => tag.trim());

    await content.save();
    await content.populate("author", "name email");

    res.json({
      success: true,
      message: "Content updated successfully",
      content,
    });
  } catch (error) {
    console.error("Error updating content:", error);
    res.status(500).json({
      success: false,
      message: "Error updating content",
      error: error.message,
    });
  }
};

// Delete content (author only)
const deleteContent = async (req, res) => {
  try {
    console.log("=== deleteContent called ===");
    console.log("Content ID:", req.params.id);
    console.log("User:", req.user);

    const { id } = req.params;

    const content = await Content.findById(id);

    if (!content) {
      console.log("Content not found for ID:", id);
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    console.log("Found content:", content.title);
    console.log("Content author:", content.author);

    // Check if user is the author
    const userId = req.user.id || req.user._id;
    console.log(
      "Comparing author:",
      content.author.toString(),
      "with user:",
      userId.toString()
    );

    if (content.author.toString() !== userId.toString()) {
      console.log("User not authorized to delete this content");
      return res.status(403).json({
        success: false,
        message: "You can only delete your own content",
      });
    }

    console.log("Deleting content...");
    await Content.findByIdAndDelete(id);
    console.log("Content deleted successfully");

    res.json({
      success: true,
      message: "Content deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting content:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting content",
      error: error.message,
    });
  }
};

// Like/Unlike content
const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user._id;

    const content = await Content.findById(id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    // Check if user already liked this content
    const existingLike = content.likes.find(
      (like) => like.user.toString() === userId.toString()
    );

    if (existingLike) {
      // Remove like
      content.likes = content.likes.filter(
        (like) => like.user.toString() !== userId.toString()
      );
    } else {
      // Add like
      content.likes.push({ user: userId });
    }

    await content.save();

    res.json({
      success: true,
      isLiked: !existingLike,
      likeCount: content.likes.length,
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({
      success: false,
      message: "Error updating like",
      error: error.message,
    });
  }
};

// Add comment to content
const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
      });
    }

    const content = await Content.findById(id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    content.comments.push({
      user: req.user.id || req.user._id,
      text: text.trim(),
    });

    await content.save();
    await content.populate("comments.user", "name email");

    res.json({
      success: true,
      message: "Comment added successfully",
      comment: content.comments[content.comments.length - 1],
      commentCount: content.comments.length,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({
      success: false,
      message: "Error adding comment",
      error: error.message,
    });
  }
};

export {
  createContent,
  getAllContent,
  getContentById,
  getMyContent,
  updateContent,
  deleteContent,
  toggleLike,
  addComment,
};
