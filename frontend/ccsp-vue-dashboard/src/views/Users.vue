<template>
  <div class="users">
    <h1 class="text-2xl font-bold mb-6">用戶活動</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- User stats -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">用戶統計</h2>
        <div class="flex items-center justify-between mb-4">
          <span class="text-gray-600">總用戶</span>
          <span class="text-2xl font-bold">{{
            userMetrics.totalUsers || 0
          }}</span>
        </div>
        <div class="flex items-center justify-between mb-4">
          <span class="text-gray-600">本月活躍用戶</span>
          <span class="text-xl font-semibold">{{
            getCurrentMonthActiveUsers()
          }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-gray-600">今日活躍用戶</span>
          <span class="text-xl font-semibold">{{ getTodayActiveUsers() }}</span>
        </div>
      </div>

      <!-- Daily users chart -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">日活躍用戶 (DAU)</h2>
        <div class="h-64">
          <!-- Add line chart component here -->
          <p class="text-gray-500 text-center pt-16" v-if="loading">
            加載中...
          </p>
          <p
            class="text-gray-500 text-center pt-16"
            v-else-if="!userMetrics.dau || userMetrics.dau.length === 0"
          >
            沒有數據
          </p>
        </div>
      </div>

      <!-- Monthly users chart -->
      <div class="bg-white rounded-lg shadow p-6 md:col-span-2">
        <h2 class="text-xl font-semibold mb-4">月活躍用戶 (MAU)</h2>
        <div class="h-64">
          <!-- Add bar chart component here -->
          <p class="text-gray-500 text-center pt-16" v-if="loading">
            加載中...
          </p>
          <p
            class="text-gray-500 text-center pt-16"
            v-else-if="!userMetrics.mau || userMetrics.mau.length === 0"
          >
            沒有數據
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { apiService } from "../services/api-service";

// Define interface for user metrics
interface UserMetrics {
  dau: Array<{ date: string; count: string }>;
  mau: Array<{ month: string; count: string }>;
  totalUsers: number;
}

// Set up reactive data
const userMetrics = ref<UserMetrics>({
  dau: [],
  mau: [],
  totalUsers: 0,
});
const loading = ref(true);

// Get today's active users
const getTodayActiveUsers = () => {
  if (!userMetrics.value.dau || !userMetrics.value.dau.length) return 0;

  const today = new Date().toISOString().split("T")[0];
  const todayUsers = userMetrics.value.dau.find((item) => item.date === today);
  return todayUsers ? todayUsers.count : 0;
};

// Get current month's active users
const getCurrentMonthActiveUsers = () => {
  if (!userMetrics.value.mau || !userMetrics.value.mau.length) return 0;

  const currentMonth = new Date().toISOString().substring(0, 7); // Format: YYYY-MM
  const currentMonthUsers = userMetrics.value.mau.find(
    (item) => item.month === currentMonth
  );
  return currentMonthUsers ? currentMonthUsers.count : 0;
};

// Fetch user data from API
const fetchUserData = async () => {
  try {
    loading.value = true;
    const response = await apiService.getUserMetrics();
    userMetrics.value = response;
  } catch (error) {
    console.error("Error fetching user metrics:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchUserData();
});
</script>
