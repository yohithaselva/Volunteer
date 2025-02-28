// src/services/notificationService.js
import api from "./api";

export const fetchNotifications = async () => {
  return api.get("/notifications");
};

export const markNotificationAsRead = async (notificationId) => {
  return api.patch(`/notifications/${notificationId}/read`);
};
