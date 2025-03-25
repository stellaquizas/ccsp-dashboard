<template>
  <div class="p-6">
    <!-- Main Title -->
    <h1 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
      用戶統計
    </h1>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"
      ></div>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- User Registration Stats -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            用戶注冊總數
          </h2>
          <div class="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              @click="registrationTimeRange = 'total'"
              class="px-3 py-1 text-sm rounded-md transition"
              :class="
                registrationTimeRange === 'total'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              "
            >
              總計
            </button>
            <button
              @click="registrationTimeRange = 'month'"
              class="px-3 py-1 text-sm rounded-md transition"
              :class="
                registrationTimeRange === 'month'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              "
            >
              最近一個月
            </button>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-4">
          <div
            class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700"
          >
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                v-for="(stat, index) in userRegistrationStats"
                :key="index"
                class="flex items-center"
              >
                <div class="p-3 rounded-full mr-4" :class="stat.bgColor">
                  <component
                    :is="stat.icon"
                    class="w-6 h-6"
                    :class="stat.iconColor"
                  />
                </div>
                <div>
                  <p
                    class="text-sm font-medium text-gray-600 dark:text-gray-400"
                  >
                    {{ stat.label }}
                  </p>
                  <p
                    class="text-xl font-semibold text-gray-900 dark:text-white"
                  >
                    {{ stat.value }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Active Users Stats -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            活躍用戶
          </h2>
          <div class="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              @click="timeRange = 'daily'"
              class="px-3 py-1 text-sm rounded-md transition"
              :class="
                timeRange === 'daily'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              "
            >
              當日
            </button>
            <button
              @click="timeRange = 'monthly'"
              class="px-3 py-1 text-sm rounded-md transition"
              :class="
                timeRange === 'monthly'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              "
            >
              最近一個月
            </button>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-4">
          <div
            class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700"
          >
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                v-for="(stat, index) in activeUserStats"
                :key="index"
                class="flex items-center"
              >
                <div class="p-3 rounded-full mr-4" :class="stat.bgColor">
                  <component
                    :is="stat.icon"
                    class="w-6 h-6"
                    :class="stat.iconColor"
                  />
                </div>
                <div>
                  <p
                    class="text-sm font-medium text-gray-600 dark:text-gray-400"
                  >
                    {{ stat.label }}
                  </p>
                  <p
                    class="text-xl font-semibold text-gray-900 dark:text-white"
                  >
                    {{ stat.value }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Registration Trends -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700 mb-6"
      >
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            注冊趨勢（系統成立至今）
          </h2>
          <div class="flex space-x-2">
            <button
              v-for="option in trendDisplayOptions"
              :key="option.value"
              @click="trendDisplayMode = option.value"
              class="px-3 py-1 rounded-lg text-sm font-medium transition-colors"
              :class="{
                'bg-blue-600 text-white': trendDisplayMode === option.value,
                'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600':
                  trendDisplayMode !== option.value,
              }"
            >
              {{ option.label }}
            </button>
          </div>
        </div>
        <div class="h-64">
          <div
            v-if="!registrationTrends.length"
            class="flex items-center justify-center h-full text-gray-500 dark:text-gray-400"
          >
            暫無數據
          </div>
          <div v-else class="h-full">
            <div class="h-full flex items-end justify-between space-x-1">
              <div
                v-for="(trend, index) in displayedTrends"
                :key="index"
                class="flex-1 bg-blue-600 dark:bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-700 dark:hover:bg-blue-600"
                :style="{ height: `${(trend.count / maxTrendCount) * 100}%` }"
                :title="`${formatDate(trend.date)}: ${trend.count} 名用戶`"
              ></div>
            </div>
            <div
              class="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400"
            >
              <span>{{ formatDate(registrationTrends[0]?.date) }}</span>
              <span>{{
                formatDate(
                  registrationTrends[registrationTrends.length - 1]?.date
                )
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Active User Trends Chart -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700"
      >
        <h2 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          用戶活躍度趨勢（系統成立至今）
        </h2>
        <div class="h-64">
          <div
            v-if="!activeUserTrends.length"
            class="flex items-center justify-center h-full text-gray-500"
          >
            暫無數據
          </div>
          <div v-else class="relative h-full">
            <!-- Y-axis labels -->
            <div
              class="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400"
            >
              <span>{{ maxActiveCount }}</span>
              <span>{{ Math.floor(maxActiveCount / 2) }}</span>
              <span>0</span>
            </div>

            <!-- Chart Area -->
            <div class="absolute left-8 right-0 top-0 bottom-4 flex items-end">
              <div class="h-full w-full flex items-end space-x-1">
                <div
                  v-for="(item, index) in activeUserTrends"
                  :key="index"
                  class="relative flex-1 bg-green-500 dark:bg-green-600 rounded-t transition-all hover:bg-green-600 dark:hover:bg-green-700 cursor-pointer group"
                  :style="{
                    height: `${(item.count / maxActiveCount) * 100}%`,
                  }"
                >
                  <!-- Tooltip -->
                  <div
                    class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10"
                  >
                    {{ formatDate(item.date) }}: {{ item.count }} 個用戶
                  </div>
                </div>
              </div>
            </div>

            <!-- X-axis labels -->
            <div
              class="absolute left-8 right-0 bottom-0 flex justify-between text-xs text-gray-500 dark:text-gray-400"
            >
              <span>{{ formatDate(activeUserTrends[0]?.date) }}</span>
              <span>{{
                formatDate(activeUserTrends[activeUserTrends.length - 1]?.date)
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { apiService } from "../services/api-service";
import {
  UserCircleIcon,
  DevicePhoneMobileIcon,
  UsersIcon,
} from "@heroicons/vue/24/outline";

// Add time range options
const timeRangeOptions = [
  { label: "總計", value: "total" },
  { label: "最近一個月", value: "month" },
];

const selectedTimeRange = ref("total");

// Define interfaces
interface UserStats {
  iamSmartUsers: number;
  phoneUsers: number;
  undertakerUsers: number;
  monthlyIamSmartUsers: number;
  monthlyPhoneUsers: number;
  monthlyUndertakerUsers: number;
  dailyActiveUsers: Array<{ date: string; count: number }>;
  monthlyActiveUsers: Array<{ date: string; count: number }>;
  activityByType: Array<{ type: string; count: number }>;
}

const loading = ref(true);
const userData = ref<UserStats | null>(null);

// State for time ranges
const timeRange = ref<"daily" | "monthly">("daily");
const registrationTimeRange = ref<"total" | "month">("total");

// Add trend display options and state
const trendDisplayOptions = [
  { label: "累計", value: "cumulative" },
  { label: "新增", value: "new" },
];
const trendDisplayMode = ref("cumulative");

// Update user registration stats computed property
const userRegistrationStats = computed(() => {
  if (!userData.value) return [];
  const stats = userData.value;
  const isMonthly = registrationTimeRange.value === "month";

  return [
    {
      label: "iAM SMART 用戶",
      value: isMonthly ? stats.monthlyIamSmartUsers : stats.iamSmartUsers,
      icon: UserCircleIcon,
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "手機號碼用戶",
      value: isMonthly ? stats.monthlyPhoneUsers : stats.phoneUsers,
      icon: DevicePhoneMobileIcon,
      bgColor: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      label: "殯儀館用戶",
      value: isMonthly ? stats.monthlyUndertakerUsers : stats.undertakerUsers,
      icon: UsersIcon,
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
  ];
});

const dailyActiveUsers = computed(() => {
  return userData.value?.dailyActiveUsers || [];
});

const monthlyActiveUsers = computed(() => {
  return userData.value?.monthlyActiveUsers || [];
});

const userActivityByType = computed(() => {
  return userData.value?.activityByType || [];
});

const maxDailyUsers = computed(() => {
  if (!dailyActiveUsers.value.length) return 0;
  return Math.max(...dailyActiveUsers.value.map((user) => user.count));
});

const maxMonthlyUsers = computed(() => {
  if (!monthlyActiveUsers.value.length) return 0;
  return Math.max(...monthlyActiveUsers.value.map((user) => user.count));
});

const maxActivityCount = computed(() => {
  if (!userActivityByType.value.length) return 0;
  return Math.max(
    ...userActivityByType.value.map((activity) => activity.count)
  );
});

// Fetch data from API
const fetchUserData = async () => {
  try {
    loading.value = true;
    const response = await apiService.getUserStats();
    userData.value = response;
  } catch (error) {
    console.error("Error fetching user data:", error);
  } finally {
    loading.value = false;
  }
};

// Initial data fetch
onMounted(() => {
  fetchUserData();
});

// Listen for refresh events
window.addEventListener("refresh-dashboard", fetchUserData);

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-HK", { month: "numeric", day: "numeric" });
};

// Active users stats based on selected time range
const activeUserStats = computed(() => {
  if (!userData.value) return [];

  if (timeRange.value === "daily") {
    return [
      {
        label: "iAM Smart 活躍用戶",
        value:
          userData.value.dailyIamSmartUsers ||
          Math.floor(userData.value.iamSmartUsers / 10),
        icon: UserCircleIcon,
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
        iconColor: "text-blue-600 dark:text-blue-400",
      },
      {
        label: "手機號碼活躍用戶",
        value:
          userData.value.dailyPhoneUsers ||
          Math.floor(userData.value.phoneUsers / 10),
        icon: DevicePhoneMobileIcon,
        bgColor: "bg-green-100 dark:bg-green-900/30",
        iconColor: "text-green-600 dark:text-green-400",
      },
      {
        label: "殯葬業界活躍用戶",
        value:
          userData.value.dailyUndertakerUsers ||
          Math.floor(userData.value.undertakerUsers / 10),
        icon: UsersIcon,
        bgColor: "bg-purple-100 dark:bg-purple-900/30",
        iconColor: "text-purple-600 dark:text-purple-400",
      },
    ];
  } else {
    return [
      {
        label: "iAM Smart 活躍用戶",
        value:
          userData.value.monthlyIamSmartUsers ||
          Math.floor(userData.value.iamSmartUsers / 3),
        icon: UserCircleIcon,
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
        iconColor: "text-blue-600 dark:text-blue-400",
      },
      {
        label: "手機號碼活躍用戶",
        value:
          userData.value.monthlyPhoneUsers ||
          Math.floor(userData.value.phoneUsers / 3),
        icon: DevicePhoneMobileIcon,
        bgColor: "bg-green-100 dark:bg-green-900/30",
        iconColor: "text-green-600 dark:text-green-400",
      },
      {
        label: "殯葬業界活躍用戶",
        value:
          userData.value.monthlyUndertakerUsers ||
          Math.floor(userData.value.undertakerUsers / 3),
        icon: UsersIcon,
        bgColor: "bg-purple-100 dark:bg-purple-900/30",
        iconColor: "text-purple-600 dark:text-purple-400",
      },
    ];
  }
});

// Get registration trends from userData - should always show whole period
const registrationTrends = computed(() => {
  if (!userData.value) return [];
  // Always return full registration trends data regardless of toggle
  return userData.value.registrationTrends || [];
});

// Get active user trends - should always show whole period
const activeUserTrends = computed(() => {
  if (!userData.value) return [];
  // Always return full monthly active user trends
  return userData.value.monthlyActiveUsers || [];
});

// Calculate maximum values for charts
const maxRegistrationCount = computed(() => {
  if (!registrationTrends.value.length) return 0;
  return Math.max(...registrationTrends.value.map((t) => t.count));
});

const maxActiveCount = computed(() => {
  if (!activeUserTrends.value.length) return 0;
  return Math.max(...activeUserTrends.value.map((t) => t.count));
});

// Modify the computed property to handle different display modes
const displayedTrends = computed(() => {
  if (!registrationTrends.value.length) return [];

  if (trendDisplayMode.value === "new") {
    // For "新增" mode, just return the original data (daily new registrations)
    return registrationTrends.value;
  } else {
    // For "累計" mode, calculate cumulative sum
    let cumulativeSum = 0;
    return registrationTrends.value.map((trend) => ({
      date: trend.date,
      count: (cumulativeSum += trend.count),
    }));
  }
});

// Update maxTrendCount to use the displayed trends
const maxTrendCount = computed(() => {
  if (!displayedTrends.value.length) return 0;
  return Math.max(...displayedTrends.value.map((trend) => trend.count));
});
</script>
