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

// Generate random number within a range
const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate random date within a range
const randomDate = (start: Date, end: Date) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

// Application types based on ccsp_service_code
const applicationTypes = [
  { code: "ABB", name: "流產胎安放服務" },
  { code: "ACB", name: "流產胎火化服務" },
  { code: "BU", name: "安葬於公眾墳場" },
  { code: "COB", name: "土葬證明書" },
  { code: "COC", name: "火葬證明書" },
  { code: "EX", name: "遷移或撿拾骨殖許可證" },
  { code: "NI", name: "編配骨灰龕位" },
  { code: "NIR", name: "移除先人骨灰" },
  { code: "SA", name: "海上撒灰" },
  { code: "SC", name: "安排骨殖火化" },
  { code: "TS", name: "骨灰暫存服務" },
  { code: "UR", name: "安排金塔土葬" },
];

// Status mapping based on ccsp_system_code
const statusMapping: Record<string, { text: string; color: string }> = {
  DFT: { text: "已遞交", color: "gray" },
  AP_DFT: { text: "處理中", color: "yellow" },
  APP: { text: "已獲批准", color: "green" },
  RJ_DFT: { text: "申請被拒", color: "red" },
  RJP: { text: "申請被拒", color: "red" },
  CNR: { text: "取消付款", color: "orange" },
  BOK: { text: "已付款", color: "blue" },
  CAP: { text: "已取消申請", color: "gray" },
  CIN: { text: "已完成", color: "green" },
  COT: { text: "已取回", color: "green" },
  REP: { text: "處理中", color: "yellow" },
  RCI: { text: "待處理", color: "yellow" },
  RCO: { text: "待取回", color: "yellow" },
  ERM: { text: "過期預備移除", color: "red" },
  ECT: { text: "過期已移除", color: "red" },
  REM: { text: "申請移除", color: "orange" },
  APM: { text: "已獲批准取回", color: "blue" },
  RLS: { text: "釋放龕位", color: "green" },
  CNM: { text: "批核無效", color: "red" },
  MAP: { text: "需親自辦理", color: "yellow" },
};

// Add missing functions for generating mock data
const generateDailyActiveUsers = () => {
  return Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    count: randomInt(100, 500),
  }));
};

const generateMonthlyActiveUsers = () => {
  return Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    count: randomInt(200, 800),
  }));
};

const generateActivityByType = () => {
  return applicationTypes.map((type) => ({
    type: type.name,
    count: randomInt(50, 300),
  }));
};

// Generate registration trends data for the past 30 days
const generateRegistrationTrends = () => {
  return Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString().split("T")[0],
      count: randomInt(10, 60),
    };
  });
};

// Update generateMockData to use the new functions
const generateMockData = () => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Generate application trends with total, completed, and pending counts
  const trends = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(thirtyDaysAgo);
    date.setDate(date.getDate() + i);
    return {
      date: date.toISOString().split("T")[0],
      total: randomInt(5, 50),
      completed: randomInt(2, 30),
      pending: randomInt(1, 20),
    };
  });

  // Calculate daily active users for each type
  const dailyIamSmartUsers = randomInt(30, 100);
  const dailyPhoneUsers = randomInt(20, 80);
  const dailyUndertakerUsers = randomInt(5, 30);

  // Calculate monthly active users for each type
  const monthlyIamSmartUsers = randomInt(100, 300);
  const monthlyPhoneUsers = randomInt(80, 250);
  const monthlyUndertakerUsers = randomInt(20, 80);

  return {
    userStats: {
      iamSmartUsers: Math.floor(Math.random() * 1000) + 500,
      phoneUsers: Math.floor(Math.random() * 800) + 300,
      undertakerUsers: Math.floor(Math.random() * 200) + 100,
      monthlyIamSmartUsers,
      monthlyPhoneUsers,
      monthlyUndertakerUsers,
      dailyIamSmartUsers,
      dailyPhoneUsers,
      dailyUndertakerUsers,
      dailyActiveUsers: generateDailyActiveUsers(),
      monthlyActiveUsers: generateMonthlyActiveUsers(),
      activityByType: generateActivityByType(),
      registrationTrends: generateRegistrationTrends(),
    },
    applicationStats: {
      totalApplications: randomInt(500, 5000),
      pendingApplications: randomInt(100, 1000),
      completedApplications: randomInt(200, 2000),
      unprocessedApplications: randomInt(50, 500),
    },
    applicationTrends: trends,
  };
};

// Generate random application data
const generateMockApplications = (type?: string) => {
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  // Get possible statuses based on application type
  const getPossibleStatuses = (appType: string) => {
    const statusMap: Record<string, string[]> = {
      ABB: ["DFT", "AP_DFT", "APP", "RJ_DFT", "CAP", "CIN"],
      ACB: ["DFT", "AP_DFT", "APP", "RJ_DFT", "CAP", "CIN"],
      BU: ["DFT", "AP_DFT", "APP", "RJ_DFT", "CAP", "CIN"],
      COB: ["DFT", "APP", "BOK", "CNR", "CAP", "RJP"],
      COC: ["DFT", "APP", "BOK", "CNR", "CAP", "RJP"],
      EX: ["DFT", "AP_DFT", "APP", "RJ_DFT", "CAP", "COT"],
      NI: ["DFT", "AP_DFT", "APP", "RJ_DFT", "CAP", "CIN", "BOK", "CNR"],
      NIR: ["DFT", "AP_DFT", "APP", "RJ_DFT", "CAP", "COT"],
      SA: ["DFT", "AP_DFT", "APP", "RJ_DFT", "CAP", "CIN"],
      SC: ["DFT", "AP_DFT", "APP", "RJ_DFT", "CAP", "CIN"],
      TS: ["DFT", "AP_DFT", "APP", "RJ_DFT", "CAP", "CIN", "BOK", "CNR"],
      UR: ["DFT", "AP_DFT", "APP", "RJ_DFT", "CAP", "CIN"],
    };
    return statusMap[appType] || ["DFT", "AP_DFT", "APP", "RJ_DFT", "CAP"];
  };

  // Generate applications
  const applications = Array.from({ length: randomInt(5, 15) }, (_, i) => {
    const appType =
      type ||
      applicationTypes[Math.floor(Math.random() * applicationTypes.length)]
        .code;
    const submitDate = randomDate(thirtyDaysAgo, today);
    const possibleStatuses = getPossibleStatuses(appType);
    const status =
      possibleStatuses[Math.floor(Math.random() * possibleStatuses.length)];

    return {
      id: `APP${String(i + 1).padStart(6, "0")}`,
      type: appType,
      status: status,
      submitDate: submitDate.toISOString().split("T")[0],
      processingTime: randomInt(1, 30),
    };
  });

  // Generate status breakdown
  const statusBreakdown = Object.entries(
    applications.reduce(
      (acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    )
  ).map(([status, count]) => ({
    name: statusMapping[status]?.text || status,
    count,
  }));

  // Calculate processing times
  const processingTimes = applications.map((app) => app.processingTime);
  const avgProcessingTime = Math.round(
    processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length
  );
  const maxProcessingTime = Math.max(...processingTimes);

  return {
    applications,
    statusBreakdown,
    trends: Array.from({ length: 30 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      return {
        date: date.toISOString().split("T")[0],
        count: randomInt(1, 5),
      };
    }).reverse(),
    avgProcessingTime,
    maxProcessingTime,
  };
};

// Define API service
export const apiService = {
  // User statistics
  async getUserStats() {
    if (import.meta.env.DEV) {
      const mockData = generateMockData();
      return mockData.userStats;
    }
    const response = await apiClient.get("/api/user-stats");
    return response.data;
  },

  // Application statistics
  async getApplicationStats() {
    if (import.meta.env.DEV) {
      const mockData = generateMockData();
      return mockData.applicationStats;
    }
    const response = await apiClient.get("/api/application-stats");
    return response.data;
  },

  // Application trends
  async getApplicationTrends() {
    if (import.meta.env.DEV) {
      const mockData = generateMockData();
      return mockData.applicationTrends;
    }
    const response = await apiClient.get("/api/application-trends");
    return response.data;
  },

  // Forms
  async getForms() {
    if (import.meta.env.DEV) {
      return [
        {
          id: "FORM001",
          name: "流產胎安放服務",
          description: "申請安放流產胎於公眾墳場",
          status: "active",
        },
        {
          id: "FORM002",
          name: "流產胎火化服務",
          description: "申請火化流產胎",
          status: "active",
        },
        {
          id: "FORM003",
          name: "安葬於公眾墳場",
          description: "申請安葬於公眾墳場",
          status: "active",
        },
      ];
    }
    const response = await apiClient.get("/api/forms");
    return response.data;
  },

  // Get applications with optional type filter
  async getApplications(type?: string) {
    if (import.meta.env.DEV) {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const mockData = generateMockData();
      const applications = Array.from({ length: 10 }, (_, i) => ({
        id: `APP${String(i + 1).padStart(4, "0")}`,
        type:
          type ||
          applicationTypes[Math.floor(Math.random() * applicationTypes.length)]
            .code,
        status:
          Object.keys(statusMapping)[
            Math.floor(Math.random() * Object.keys(statusMapping).length)
          ],
        submissionDate: randomDate(thirtyDaysAgo, now).toISOString(),
        processingTime: randomInt(1, 30),
      }));

      const statusBreakdown = applications.reduce(
        (acc, app) => {
          acc[app.status] = (acc[app.status] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      const processingTimes = applications.map((app) => app.processingTime);
      const avgProcessingTime =
        processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length;
      const maxProcessingTime = Math.max(...processingTimes);

      return {
        applications,
        statusBreakdown: Object.entries(statusBreakdown).map(
          ([status, count]) => ({
            name: statusMapping[status]?.text || status,
            count,
          })
        ),
        avgProcessingTime,
        maxProcessingTime,
      };
    }
    const response = await apiClient.get("/api/applications", {
      params: { type },
    });
    return response.data;
  },

  // Update the mock getApplications method to use valid status codes
  getApplications: async (type?: string): Promise<any> => {
    // Mock data generation for development
    if (process.env.NODE_ENV === "development") {
      // Define status mapping based on actual codes from ccsp_system_code table
      const statusMapping: Record<string, string> = {
        // Common statuses across most application types
        DFT: "已遞交",
        AP_DFT: "處理中",
        RJ_DFT: "申請被拒",
        REP: "處理中",
        APP: "已獲批准",
        RJP: "申請被拒",
        BOK: "已付款",
        CNR: "取消付款",
        CAP: "已取消申請",
        CIN: "已完成",
      };

      // Application types based on SQL data
      const applicationTypes = [
        "ABB",
        "ACB",
        "BU",
        "COB",
        "COC",
        "EX",
        "NI",
        "NIR",
        "SA",
        "SC",
        "TS",
        "UR",
      ];

      // Calculate date ranges
      const now = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);

      // Filter applications based on type
      let filteredType = type || applicationTypes[0];

      // Mock applications data
      const applications = Array.from({ length: 50 }, (_, i) => {
        // Use valid status codes based on the type selected
        const statusCodes = ["DFT", "AP_DFT", "APP", "CIN", "RJ_DFT"];
        const status =
          statusCodes[Math.floor(Math.random() * statusCodes.length)];

        // Generate a random date within the last 30 days
        const submissionDate = new Date(
          thirtyDaysAgo.getTime() +
            Math.random() * (now.getTime() - thirtyDaysAgo.getTime())
        ).toISOString();

        const processingTime = Math.floor(Math.random() * 14) + 1;

        return {
          id: `ID-${i + 100}`,
          type: filteredType,
          status,
          submissionDate,
          processingTime: status === "CIN" ? processingTime : 0,
        };
      });

      // Calculate status breakdown
      const statusBreakdown = (statusCodes) => {
        return statusCodes.map((code) => ({
          name: statusMapping[code] || code,
          count: Math.floor(Math.random() * 20) + 5,
        }));
      };

      // Generate mock trends for 30 days
      const trends = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(thirtyDaysAgo);
        date.setDate(date.getDate() + i);
        return {
          date: date.toISOString(),
          total: Math.floor(Math.random() * 10) + 5,
          completed: Math.floor(Math.random() * 5),
          pending: Math.floor(Math.random() * 5),
        };
      });

      // Create a response with valid status codes
      return {
        applications: applications.map((app) => ({
          ...app,
          status: statusMapping[app.status] || app.status,
        })),
        statusBreakdown: statusBreakdown([
          "DFT",
          "AP_DFT",
          "APP",
          "CIN",
          "RJ_DFT",
        ]),
        avgProcessingTime: Math.floor(Math.random() * 7) + 3,
        maxProcessingTime: Math.floor(Math.random() * 15) + 10,
        trends,
      };
    }

    // For production, use the actual API
    try {
      const response = await axios.get(
        `/api/applications${type ? `?type=${type}` : ""}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching applications:", error);
      throw error;
    }
  },
};
