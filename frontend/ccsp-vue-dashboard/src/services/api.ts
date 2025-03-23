import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface ApplicationMetrics {
  totalCount: number;
  typeBreakdown: { type: string; count: string }[];
  statusBreakdown: { status: string; count: string }[];
  avgProcessingTime: { type: string; avg_time: string }[];
  pendingApplications: {
    over_7_days: string;
    over_14_days: string;
  };
}

export interface ApplicationTrend {
  date: string;
  count: string;
}

export interface UserMetrics {
  dau: { date: string; count: string }[];
  mau: { month: string; count: string }[];
  totalUsers: number;
}

export default {
  // Application metrics
  async getApplicationMetrics(): Promise<ApplicationMetrics> {
    const response = await api.get("/api/applications/metrics");
    return response.data;
  },

  // Application trends
  async getApplicationTrends(
    startDate?: string,
    endDate?: string
  ): Promise<ApplicationTrend[]> {
    let url = "/api/applications/trends";
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    const response = await api.get(url);
    return response.data;
  },

  // User metrics
  async getUserMetrics(): Promise<UserMetrics> {
    const response = await api.get("/api/users/metrics");
    return response.data;
  },
};
