import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxLength: 500,
    },
    fullContent: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Ethics",
        "Metaphysics",
        "Logic",
        "Epistemology",
        "Political Philosophy",
        "Eastern Philosophy",
        "Existentialism",
        "Modern Ethics",
        "Ancient Philosophy",
        "Philosophy of Science",
      ],
    },
    likes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          required: true,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    shares: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
    },
    readTime: {
      type: Number, // in minutes
      default: 5,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Virtual for like count
contentSchema.virtual("likeCount").get(function () {
  return this.likes.length;
});

// Virtual for comment count
contentSchema.virtual("commentCount").get(function () {
  return this.comments.length;
});

// Virtual for formatted timestamp
contentSchema.virtual("timeAgo").get(function () {
  const now = new Date();
  const diff = now - this.createdAt;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
});

// Ensure virtuals are included when converting to JSON
contentSchema.set("toJSON", { virtuals: true });
contentSchema.set("toObject", { virtuals: true });

export default mongoose.model("Content", contentSchema);
