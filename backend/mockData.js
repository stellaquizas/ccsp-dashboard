// Helper functions
const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randomDate = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

// Constants
const applicationTypes = [
  { code: "CCABB", name: "流產胎安放服務" },
  { code: "CCACB", name: "流產胎火化服務" },
  { code: "CCBUB", name: "安葬於公眾墳場" },
  { code: "CCEXB", name: "遷移或撿拾骨殖許可證" },
  { code: "CCNIB", name: "骨灰龕位申請" },
  { code: "CCNIB_ADD", name: "加放骨灰申請" },
  { code: "CCNIB_REM", name: "取回骨灰申請" },
  { code: "CCSAB", name: "海上撒灰" },
  { code: "CCSCB", name: "火化服務" },
  { code: "CCTSB", name: "骨灰暫存服務" },
  { code: "CCURB", name: "骨灰罐更換服務" }
];

const statusMapping = {
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

// Mock data generation functions
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

const generateMockData = () => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

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

  const dailyIamSmartUsers = randomInt(30, 100);
  const dailyPhoneUsers = randomInt(20, 80);
  const dailyUndertakerUsers = randomInt(5, 30);
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

const generateMockApplications = (type) => {
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const getPossibleStatuses = (appType) => {
    const statusMap = {
      CCABB: ["DFT", "AP_DFT", "APP", "RJ_DFT", "CAP", "CIN"],
      CCACB: ["DFT", "AP_DFT", "APP", "RJ_DFT", "CAP", "CIN"],
      CCBUB: ["DFT", "AP_DFT", "APP", "RJ_DFT", "CAP", "CIN"],
      CCEXB: ["DFT", "AP_DFT", "APP", "RJ_DFT", "CAP", "COT"],
      CCNIB: ["DFT", "AP_DFT", "APP", "RJ_DFT", "CAP", "CIN", "BOK", "CNR"],
      CCNIB_ADD: ["DFT", "AP_DFT", "APP", "RJ_DFT", "CAP", "CIN", "BOK", "CNR"],
      CCNIB_REM: ["DFT", "AP_DFT", "APP", "RJ_DFT", "CAP", "COT"],
      CCSAB: ["DFT", "AP_DFT", "APP", "RJ_DFT", "CAP", "CIN"],
      CCSCB: ["DFT", "AP_DFT", "APP", "RJ_DFT", "CAP", "CIN"],
      CCTSB: ["DFT", "AP_DFT", "APP", "RJ_DFT", "CAP", "CIN", "BOK", "CNR"],
      CCURB: ["DFT", "AP_DFT", "APP", "RJ_DFT", "CAP", "CIN"]
    };
    return statusMap[appType] || ["DFT", "AP_DFT", "APP", "RJ_DFT", "CAP"];
  };

  const applications = Array.from({ length: randomInt(5, 15) }, (_, i) => {
    const appType = type || applicationTypes[Math.floor(Math.random() * applicationTypes.length)].code;
    const submitDate = randomDate(thirtyDaysAgo, today);
    const possibleStatuses = getPossibleStatuses(appType);
    const status = possibleStatuses[Math.floor(Math.random() * possibleStatuses.length)];

    return {
      id: `APP${String(i + 1).padStart(6, "0")}`,
      type: appType,
      status: status,
      submitDate: submitDate.toISOString().split("T")[0],
      processingTime: randomInt(1, 30),
    };
  });

  const statusBreakdown = Object.entries(
    applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([status, count]) => ({
    name: statusMapping[status]?.text || status,
    count,
  }));

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
      const total = randomInt(10, 60);
      const completed = randomInt(5, Math.floor(total * 0.8));
      const processing = randomInt(2, Math.floor((total - completed) * 0.8));
      return {
        date: date.toISOString().split("T")[0],
        count: total,
        completedCount: completed,
        processingCount: processing
      };
    }).reverse(),
    avgProcessingTime,
    maxProcessingTime,
  };
};

// Add new mock data generation functions for user statistics
const generateTotalUsers = () => {
  return {
    rows: [{
      iamsmart_users: randomInt(500, 1000),
      phone_users: randomInt(300, 800),
      undertaker_users: randomInt(100, 200),
      total_users: randomInt(1000, 2000),
      // Add fields expected by frontend
      iamSmartUsers: randomInt(500, 1000),
      phoneUsers: randomInt(300, 800),
      undertakerUsers: randomInt(100, 200),
      monthlyIamSmartUsers: randomInt(100, 300),
      monthlyPhoneUsers: randomInt(80, 250),
      monthlyUndertakerUsers: randomInt(20, 80),
      dailyIamSmartUsers: randomInt(30, 100),
      dailyPhoneUsers: randomInt(20, 80),
      dailyUndertakerUsers: randomInt(5, 30),
      dailyActiveUsers: generateDailyActiveUsers(),
      monthlyActiveUsers: generateMonthlyActiveUsers(),
      activityByType: generateActivityByType(),
      registrationTrends: generateRegistrationTrends()
    }]
  };
};

const generateActiveUsers = () => {
  return {
    rows: [{
      monthly_iamsmart_users: randomInt(100, 300),
      monthly_phone_users: randomInt(80, 250),
      monthly_undertaker_users: randomInt(20, 80),
      total_active_users: randomInt(200, 600)
    }]
  };
};

const generateRegistrationTrend = () => {
  return {
    rows: [{
      registration_trend: randomInt(10, 60),
      daily_registrations: randomInt(5, 20)
    }]
  };
};

const generateActivityTrend = () => {
  return {
    rows: [{
      activity_trend: randomInt(50, 200),
      daily_active_users: randomInt(30, 100)
    }]
  };
};

// Export all necessary functions and constants
module.exports = {
  applicationTypes,
  statusMapping,
  generateMockData,
  generateMockApplications,
  // Export individual functions in case they're needed separately
  generateDailyActiveUsers,
  generateMonthlyActiveUsers,
  generateActivityByType,
  generateRegistrationTrends,
  // Export new user statistics functions
  generateTotalUsers,
  generateActiveUsers,
  generateRegistrationTrend,
  generateActivityTrend
}; 