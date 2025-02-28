// src/services/authService.js
import api from "./api";

export const login = async (credentials) => {
  return api.post("/auth/login", credentials);
};

export const signup = async (data) => {
  return api.post("/auth/signup", data);
};

export const resetPassword = async (email) => {
  return api.post("/auth/reset-password", { email });
};
