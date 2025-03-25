// Mock data for development
const mockData = {
  applications: {
    metrics: generateApplicationsMockMetrics(),
    trends: generateApplicationsMockTrends(),
    list: generateApplicationsMockList(),
    types: generateApplicationTypes(),
    forms: generateFormsMockData(),
  },
  users: {
    metrics: generateUserMockData(),
  },
};

// User metrics mock data
const generateUserMockData = () => {
  // Generate dates for the past 90 days
  const today = new Date();
  const dates = [];
  for (let i = 90; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split("T")[0]);
  }

  // Generate daily registration trends with increasing numbers
  const registrationTrends = dates.map((date, index) => {
    // Some days have more registrations than others, with an overall increasing trend
    const baseDailyUsers = Math.floor(Math.random() * 10) + 1; // 1-10 base users per day
    const trendFactor = Math.floor(index / 10); // Gradually increase over time

    return {
      date,
      count: baseDailyUsers + trendFactor,
    };
  });

  // Generate daily active users
  const dailyActiveUsers = dates.slice(-30).map((date) => ({
    date,
    count: Math.floor(Math.random() * 100) + 50, // 50-150 daily active users
  }));

  // Generate monthly active users (past 12 months)
  const monthlyActiveUsers = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(today.getMonth() - i);
    const yearMonth = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    monthlyActiveUsers.push({
      date: `${yearMonth}-01`,
      count: Math.floor(Math.random() * 500) + 1000, // 1000-1500 monthly active users
    });
  }

  // Activity by type
  const activityByType = [
    { type: "骨灰龕位申請", count: 250 },
    { type: "火化服務", count: 200 },
    { type: "海上撒灰服務", count: 150 },
    { type: "骨灰暫存服務", count: 100 },
    { type: "加放骨灰申請", count: 80 },
    { type: "取回骨灰申請", count: 70 },
    { type: "墳場埋葬服務", count: 60 },
    { type: "骨殖遷移服務", count: 50 },
    { type: "骨灰罐更換服務", count: 40 },
    { type: "流產胎安放服務", count: 30 },
    { type: "其他流產物處理服務", count: 20 },
  ];

  return {
    iamSmartUsers: 2500,
    phoneUsers: 1800,
    undertakerUsers: 300,
    monthlyIamSmartUsers: 350,
    monthlyPhoneUsers: 250,
    monthlyUndertakerUsers: 50,
    dailyIamSmartUsers: 120,
    dailyPhoneUsers: 80,
    dailyUndertakerUsers: 20,
    registrationTrends,
    dailyActiveUsers,
    monthlyActiveUsers,
    activityByType,
  };
};

module.exports = mockData;
