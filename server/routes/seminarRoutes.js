import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  createSeminar,
  getAllSeminars,
  getPhilosopherSeminars,
  getSeminarById,
  registerForSeminar,
  updateSeminar,
  deleteSeminar,
} from "../controller/seminarController.js";

const router = Router();

// Public routes
router.get("/", getAllSeminars);
router.get("/:id", getSeminarById);

// Protected routes
router.post("/create", verifyToken, createSeminar);
router.get("/my/seminars", verifyToken, getPhilosopherSeminars);
router.post("/:seminarId/register", verifyToken, registerForSeminar);
router.put("/:id", verifyToken, updateSeminar);
router.delete("/:id", verifyToken, deleteSeminar);

export default router;
