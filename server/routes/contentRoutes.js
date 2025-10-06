import express from "express";
import {
  createContent,
  getAllContent,
  getContentById,
  getMyContent,
  updateContent,
  deleteContent,
  toggleLike,
  addComment,
} from "../controller/contentController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getAllContent);

// Protected routes (require authentication)
router.post("/", verifyToken, createContent);
router.get("/me", verifyToken, getMyContent);
router.get("/:id", getContentById);
router.put("/:id", verifyToken, updateContent);
router.delete("/:id", verifyToken, deleteContent);
router.post("/:id/like", verifyToken, toggleLike);
router.post("/:id/comment", verifyToken, addComment);

export default router;
