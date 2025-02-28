import api from "./api";

export const fetchTasks = async () => {
  return api.get("/tasks");
};

export const updateTaskStatus = async (taskId, status) => {
  return api.patch(`/tasks/${taskId}`, { status });
};
// src/services/volunteerService.js


export const fetchVolunteers = async () => {
  const response = await api.get('/volunteers');
  return response.data;
};

// src/services/reportService.js

export const generateReport = async () => {
  const response = await api.get('/reports');
  return response.data;
};