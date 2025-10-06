import mongoose from "mongoose";

const seminarSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hostName: {
      type: String,
      required: true,
    },
    place: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    timing: {
      startTime: {
        type: String,
        required: true,
      },
      endTime: {
        type: String,
        required: true,
      },
    },
    image: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&h=250&fit=crop",
    },
    maxAttendees: {
      type: Number,
      default: 50,
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },
    tags: [
      {
        type: String,
      },
    ],
    requirements: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
seminarSchema.index({ date: 1, status: 1 });
seminarSchema.index({ host: 1 });

export default mongoose.model("Seminar", seminarSchema);
