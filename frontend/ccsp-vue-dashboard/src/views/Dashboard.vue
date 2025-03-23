<template>
  <div class="dashboard">
    <h1 class="text-2xl font-bold mb-6">CCSP Dashboard - 墳場及火葬場服務</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Application metrics -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">申請統計</h2>
        <div class="flex items-center justify-between mb-4">
          <span class="text-gray-600">總申請</span>
          <span class="text-2xl font-bold">{{ metrics.totalCount || 0 }}</span>
        </div>
        <div class="space-y-2">
          <div
            v-for="(item, index) in metrics.statusBreakdown"
            :key="index"
            class="flex items-center justify-between"
          >
            <span class="text-gray-600">{{ item.status }}</span>
            <span class="font-semibold">{{ item.count }}</span>
          </div>
        </div>
      </div>

      <!-- Type breakdown -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">申請類型</h2>
        <div class="space-y-2">
          <div
            v-for="(item, index) in metrics.typeBreakdown"
            :key="index"
            class="flex items-center justify-between"
          >
            <span class="text-gray-600">{{ item.type }}</span>
            <span class="font-semibold">{{ item.count }}</span>
          </div>
        </div>
      </div>

      <!-- Pending applications -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">待處理申請</h2>
        <div class="flex items-center justify-between mb-4">
          <span class="text-gray-600">超過7天未處理</span>
          <span class="text-xl font-bold text-amber-500">{{
            metrics.pendingApplications?.over_7_days || 0
          }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-gray-600">超過14天未處理</span>
          <span class="text-xl font-bold text-red-500">{{
            metrics.pendingApplications?.over_14_days || 0
          }}</span>
        </div>
      </div>

      <!-- Application trend chart -->
      <div class="bg-white rounded-lg shadow p-6 col-span-1 md:col-span-2">
        <h2 class="text-xl font-semibold mb-4">申請趨勢</h2>
        <div class="h-64">
          <!-- Add line chart component here -->
          <p class="text-gray-500 text-center pt-16" v-if="!trends.length">
            加載中...
          </p>
          <p
            class="text-gray-500 text-center pt-16"
            v-else-if="trends.length === 0"
          >
            沒有數據
          </p>
        </div>
      </div>

      <!-- User activity -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">用戶活動</h2>
        <div class="flex items-center justify-between mb-4">
          <span class="text-gray-600">總用戶</span>
          <span class="text-2xl font-bold">{{
            userMetrics.totalUsers || 0
          }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-gray-600">今日活躍用戶</span>
          <span class="text-xl font-bold">{{ getTodayActiveUsers() }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { apiService } from "../services/api-service";

// Define interfaces for API responses
interface ApplicationMetrics {
  totalCount: string;
  typeBreakdown: Array<{ type: string; count: string }>;
  statusBreakdown: Array<{ status: string; count: string }>;
  avgProcessingTime: Array<{ type: string; avg_time: string }>;
  pendingApplications: {
    over_7_days: string;
    over_14_days: string;
  };
}

interface ApplicationTrend {
  date: string;
  count: string;
}

interface UserMetrics {
  dau: Array<{ date: string; count: string }>;
  mau: Array<{ month: string; count: string }>;
  totalUsers: number;
}

// Set up reactive data
const metrics = ref<ApplicationMetrics>({
  totalCount: "0",
  typeBreakdown: [],
  statusBreakdown: [],
  avgProcessingTime: [],
  pendingApplications: {
    over_7_days: "0",
    over_14_days: "0",
  },
});

const trends = ref<ApplicationTrend[]>([]);
const userMetrics = ref<UserMetrics>({
  dau: [],
  mau: [],
  totalUsers: 0,
});

// Get today's active users
const getTodayActiveUsers = () => {
  if (!userMetrics.value.dau.length) return 0;

  const today = new Date().toISOString().split("T")[0];
  const todayUsers = userMetrics.value.dau.find((item) => item.date === today);
  return todayUsers ? todayUsers.count : 0;
};

// Fetch data from API
const fetchDashboardData = async () => {
  try {
    const [metricsResponse, trendsResponse, userMetricsResponse] =
      await Promise.all([
        apiService.getApplicationMetrics(),
        apiService.getApplicationTrends(),
        apiService.getUserMetrics(),
      ]);

    metrics.value = metricsResponse;
    trends.value = trendsResponse;
    userMetrics.value = userMetricsResponse;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  }
};

onMounted(() => {
  fetchDashboardData();
});
</script>
