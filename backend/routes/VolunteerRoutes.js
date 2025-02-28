import express from "express";
import {
  getVolunteers,
  updateTaskStatus,
} from "../controllers/VolunteerController.js";

const router = express.Router();

router.get("/volunteers", getVolunteers);
router.put("/tasks/:taskId", updateTaskStatus);

export default router;
