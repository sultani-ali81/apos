// src/lib/axios.ts

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // ✅ YOUR BACKEND
  withCredentials: true,
});

export default api;
