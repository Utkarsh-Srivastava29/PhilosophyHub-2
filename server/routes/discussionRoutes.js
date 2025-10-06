import { Router } from "express";
import {verifyToken} from "../middleware/auth.js";  
import { createDiscussion, dislikeDiscussion, getAllDiscussions, getDiscussionById, likeDiscussion, updateDiscussion } from "../controller/discussionController";

const router = Router();

router.get("/all",getAllDiscussions);
router.get("/:id",getDiscussionById);
router.post("/create",verifyToken,createDiscussion);
router.put("/:id/update",verifyToken,updateDiscussion);
router.put("/:id/like",verifyToken,likeDiscussion);
router.put("/:id/dislike",verifyToken, dislikeDiscussion)

export default router;
