import axios from "axios";

// Get API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Dashboard View Mock Settings
const MOCK_USER_REGISTRATION = import.meta.env.VITE_MOCK_USER_REGISTRATION === "true";
const MOCK_APPLICATION_OVERVIEW = import.meta.env.VITE_MOCK_APPLICATION_OVERVIEW === "true";
const MOCK_APPLICATION_TRENDS = import.meta.env.VITE_MOCK_APPLICATION_TRENDS === "true";

// Forms View Mock Settings
const MOCK_FORMS = {
  CCABB: import.meta.env.VITE_MOCK_FORM_CCABB === "true",
  CCACB: import.meta.env.VITE_MOCK_FORM_CCACB === "true",
  CCBUB: import.meta.env.VITE_MOCK_FORM_CCBUB === "true",
  CCEXB: import.meta.env.VITE_MOCK_FORM_CCEXB === "true",
  CCNIB: import.meta.env.VITE_MOCK_FORM_CCNIB === "true",
  CCNIB_ADD: import.meta.env.VITE_MOCK_FORM_CCNIB_ADD === "true",
  CCNIB_REM: import.meta.env.VITE_MOCK_FORM_CCNIB_REM === "true",
  CCSAB: import.meta.env.VITE_MOCK_FORM_CCSAB === "true",
  CCSCB: import.meta.env.VITE_MOCK_FORM_CCSCB === "true",
  CCTSB: import.meta.env.VITE_MOCK_FORM_CCTSB === "true",
  CCURB: import.meta.env.VITE_MOCK_FORM_CCURB === "true",
};

// Users View Mock Settings
const MOCK_USERS = {
  ACTIVE: import.meta.env.VITE_MOCK_USER_ACTIVE === "true",
  REGISTRATION_TREND: import.meta.env.VITE_MOCK_USER_REGISTRATION_TREND === "true",
  ACTIVITY_TREND: import.meta.env.VITE_MOCK_USER_ACTIVITY_TREND === "true",
};

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Define API service
export const apiService = {
  // User statistics
  async getUserStats() {
    const response = await apiClient.get("/api/user-stats", {
      params: { 
        mockRegistration: MOCK_USER_REGISTRATION,
        mockActive: MOCK_USERS.ACTIVE,
        mockRegistrationTrend: MOCK_USERS.REGISTRATION_TREND,
        mockActivityTrend: MOCK_USERS.ACTIVITY_TREND
      }
    });
    return response.data;
  },

  // Application statistics
  async getApplicationStats() {
    const response = await apiClient.get("/api/applications/metrics", {
      params: { 
        mockOverview: MOCK_APPLICATION_OVERVIEW,
        mockTrends: MOCK_APPLICATION_TRENDS
      }
    });
    return response.data;
  },

  // Application trends
  async getApplicationTrends() {
    const response = await apiClient.get("/api/applications/trends", {
      params: { mock: MOCK_APPLICATION_TRENDS }
    });
    return response.data;
  },

  // Get applications with optional type filter
  async getApplications(type?: string) {
    const response = await apiClient.get("/api/applications", {
      params: { 
        type,
        mock: type ? MOCK_FORMS[type as keyof typeof MOCK_FORMS] : false
      }
    });
    return response.data;
  },
};

// Export types
export interface ApplicationType {
  code: string;
  name: string;
}

export interface StatusMapping {
  [key: string]: {
    text: string;
    color: string;
  };
}

// Export UserStats interface for type checking
export interface UserStats {
  iamsmart_users: number;
  phone_users: number;
  undertaker_users: number;
  total_users: number;
  monthly_iamsmart_users: number;
  monthly_phone_users: number;
  monthly_undertaker_users: number;
  total_active_users: number;
  registration_trend: number;
  daily_registrations: number;
  activity_trend: number;
  daily_active_users: number;
}
