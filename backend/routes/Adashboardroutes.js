// src/routes/dashboardRoutes.js
import express from "express";
import {
  getStats,
  getTaskCompletion,
  getTopVolunteers,
  getTopVolunteerOfMonth,
  getActivityLogs,
  getNotifications,
} from "../controllers/ADashboardController.js";

const router = express.Router();

// Dashboard routes
router.get("/stats", getStats);
router.get("/tasks", getTaskCompletion);
router.get("/volunteer-hours", getTopVolunteers);
router.get("/top-volunteer", getTopVolunteerOfMonth);
router.get("/activity-logs", getActivityLogs);
router.get("/notifications", getNotifications);

export default router;
