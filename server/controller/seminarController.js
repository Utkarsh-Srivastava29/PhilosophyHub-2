import Seminar from "../models/Seminar.js";
import User from "../models/User.js";

// Create a new seminar (Philosophers only)
export const createSeminar = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const {
      title,
      description,
      image,
      imageUrl,
      place,
      date,
      startTime,
      endTime,
      maxAttendees,
      requirements,
      tags,
    } = req.body;

    // Check if user is a philosopher
    const user = await User.findById(userId);
    if (!user || user.userType !== "philosopher") {
      return res.status(403).json({
        success: false,
        message: "Only philosophers can create seminars",
      });
    }

    // Validate required fields
    if (!title || !description || !place || !date || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // Create seminar
    const seminar = await Seminar.create({
      title,
      description,
      image: imageUrl || image || undefined,
      host: userId,
      hostName: user.name,
      place,
      date: new Date(date),
      timing: {
        startTime,
        endTime,
      },
      maxAttendees: maxAttendees || 50,
      requirements: requirements || "",
      tags: tags || [],
    });

    // Add seminar to user's seminars array
    await User.findByIdAndUpdate(userId, {
      $push: { seminars: seminar._id },
    });

    const populatedSeminar = await Seminar.findById(seminar._id).populate(
      "host",
      "name email expertise"
    );

    return res.status(201).json({
      success: true,
      seminar: populatedSeminar,
      message: "Seminar created successfully",
    });
  } catch (error) {
    console.error("Error creating seminar:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get all seminars
export const getAllSeminars = async (req, res) => {
  try {
    const { status, upcoming } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    if (upcoming === "true") {
      query.date = { $gte: new Date() };
      query.status = "upcoming";
    }

    const seminars = await Seminar.find(query)
      .populate("host", "name email expertise")
      .sort({ date: 1 });

    return res.status(200).json({
      success: true,
      seminars,
    });
  } catch (error) {
    console.error("Error fetching seminars:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get seminars by philosopher
export const getPhilosopherSeminars = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const seminars = await Seminar.find({ host: userId })
      .populate("host", "name email expertise")
      .sort({ date: -1 });

    return res.status(200).json({
      success: true,
      seminars,
    });
  } catch (error) {
    console.error("Error fetching philosopher seminars:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get seminar by ID
export const getSeminarById = async (req, res) => {
  try {
    const { id } = req.params;

    const seminar = await Seminar.findById(id)
      .populate("host", "name email expertise")
      .populate("attendees", "name email");

    if (!seminar) {
      return res.status(404).json({
        success: false,
        message: "Seminar not found",
      });
    }

    return res.status(200).json({
      success: true,
      seminar,
    });
  } catch (error) {
    console.error("Error fetching seminar:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Register for seminar
export const registerForSeminar = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { seminarId } = req.params;

    const seminar = await Seminar.findById(seminarId);
    if (!seminar) {
      return res.status(404).json({
        success: false,
        message: "Seminar not found",
      });
    }

    // Check if already registered
    if (seminar.attendees.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "Already registered for this seminar",
      });
    }

    // Check if seminar is full
    if (seminar.attendees.length >= seminar.maxAttendees) {
      return res.status(400).json({
        success: false,
        message: "Seminar is full",
      });
    }

    // Add user to attendees
    await Seminar.findByIdAndUpdate(seminarId, {
      $push: { attendees: userId },
    });

    return res.status(200).json({
      success: true,
      message: "Successfully registered for seminar",
    });
  } catch (error) {
    console.error("Error registering for seminar:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update seminar (Host only)
export const updateSeminar = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { id: seminarId } = req.params;

    const seminar = await Seminar.findById(seminarId);
    if (!seminar) {
      return res.status(404).json({
        success: false,
        message: "Seminar not found",
      });
    }

    // Check if user is the host
    if (seminar.host.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only the host can update this seminar",
      });
    }

    // Map imageUrl to image if provided
    const updateData = { ...req.body };
    if (updateData.imageUrl) {
      updateData.image = updateData.imageUrl;
      delete updateData.imageUrl;
    }

    const updatedSeminar = await Seminar.findByIdAndUpdate(
      seminarId,
      updateData,
      { new: true }
    ).populate("host", "name email expertise");

    return res.status(200).json({
      success: true,
      seminar: updatedSeminar,
      message: "Seminar updated successfully",
    });
  } catch (error) {
    console.error("Error updating seminar:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Delete seminar (Host only)
export const deleteSeminar = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { id: seminarId } = req.params;

    const seminar = await Seminar.findById(seminarId);
    if (!seminar) {
      return res.status(404).json({
        success: false,
        message: "Seminar not found",
      });
    }

    // Check if user is the host
    if (seminar.host.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only the host can delete this seminar",
      });
    }

    await Seminar.findByIdAndDelete(seminarId);

    // Remove seminar from user's seminars array
    await User.findByIdAndUpdate(userId, {
      $pull: { seminars: seminarId },
    });

    return res.status(200).json({
      success: true,
      message: "Seminar deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting seminar:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
