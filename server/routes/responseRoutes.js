import { Router } from "express";
import {
  createResponse,
  likeResponse,
} from "../controller/responseController.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();

router.post("/create", verifyToken, createResponse);
router.put("/:id/like", verifyToken, likeResponse);

export default router;
