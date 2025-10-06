import { Router } from "express";
import { verifyToken } from "../middleware/auth";
import { createComment, dislikeComment, likeComment } from "../controller/commentController";

const router = Router();

router.post("/create",verifyToken,createComment);
router.put("/:id/like",verifyToken,likeComment);
router.put("/:id/dislike",verifyToken,dislikeComment);
