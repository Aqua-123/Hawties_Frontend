// src/axiosClient.js
import axios from "axios";

const isDev = true; // Toggle this to `false` for production

const axiosClient = axios.create({
  baseURL: isDev ? "http://localhost:5000" : "https://your-production-url.com",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export default axiosClient;
