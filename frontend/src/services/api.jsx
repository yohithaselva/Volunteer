// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://api.example.com",
});

export default api;

// src/services/authService.js


export const login = async (credentials) => {
  return api.post("/auth/login", credentials);
};

export const signup = async (data) => {
  return api.post("/auth/signup", data);
};

export const resetPassword = async (email) => {
  return api.post("/auth/reset-password", { email });
};
