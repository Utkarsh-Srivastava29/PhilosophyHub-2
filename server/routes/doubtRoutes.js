import { Router } from "express";
import {
  activateDoubt,
  createDoubt,
  dislikeDoubt,
  getAllDoubts,
  getDoubtById,
  likeDoubt,
} from "../controller/doubtController.js";
import { verifyToken } from "../middleware/auth.js";
const router = Router();

router.get("/all", getAllDoubts);
router.get("/:id", getDoubtById);
router.post("/create", verifyToken, createDoubt);
router.put("/:id/active", verifyToken, activateDoubt);
router.put("/:id/inactive", verifyToken, activateDoubt);
router.put("/:id/like", verifyToken, likeDoubt);
router.put("/:id/dislike", verifyToken, dislikeDoubt);

export default router;
