// routes/volunteerRoutes.js
import express from "express";
import {
  getAssignedTasks,
  getUpcomingEvents,
  getTaskStatistics,
} from "../controllers/DashboardController.js";

const router = express.Router();

// Volunteer-specific routes
router.get("/:userId/assigned-tasks", getAssignedTasks);
router.get("/:userId/upcoming-events", getUpcomingEvents);
router.get("/:userId/task-statistics", getTaskStatistics);

export default router;
