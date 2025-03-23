import axios from "axios";

// Get API URL from environment variables or use a default value
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Define API service
export const apiService = {
  // Application metrics
  async getApplicationMetrics() {
    const response = await apiClient.get("/api/applications/metrics");
    return response.data;
  },

  // Application trends
  async getApplicationTrends() {
    const response = await apiClient.get("/api/applications/trends");
    return response.data;
  },

  // Forms
  async getForms() {
    const response = await apiClient.get("/api/applications/forms");
    return response.data;
  },

  // User metrics
  async getUserMetrics() {
    const response = await apiClient.get("/api/users/metrics");
    return response.data;
  },
};
