import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      enum: ["philosopher", "normal"],
      required: true,
      default: "normal",
    },
    expertise: {
      type: [String],
      default: [],
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    doubts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doubt",
      },
    ],
    responses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Response",
      },
    ],
    discussions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Discussion",
      },
    ],
    seminars: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seminar",
      },
    ],
    profilePicture: {
      type: String,
    },
    passwordResetToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });

export default mongoose.model("User", userSchema);
