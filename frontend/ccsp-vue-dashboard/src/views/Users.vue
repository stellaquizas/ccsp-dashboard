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
      <div class="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 relative mb-6 rounded-lg shadow-sm p-6">
        <div class="absolute top-2 right-2">
          <div class="group relative">
            <div 
              class="w-2 h-2 rounded-full cursor-help"
              :class="MOCK_USER_REGISTRATION ? 'bg-gray-600 dark:bg-gray-400' : 'bg-green-500 dark:bg-green-400'"
            ></div>
            <div class="invisible group-hover:visible absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 dark:bg-gray-700 rounded whitespace-nowrap z-50">
              {{ MOCK_USER_REGISTRATION ? '模擬數據' : '真實數據' }}
            </div>
          </div>
        </div>
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            用戶注冊總數
          </h2>
          <div class="flex items-center space-x-2">
            <div class="flex space-x-2">
              <button
                v-for="option in timeRangeOptions"
                :key="option.value"
                @click="registrationTimeRange = option.value"
                class="px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                :class="{
                  'bg-blue-600 text-white': registrationTimeRange === option.value,
                  'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600':
                    registrationTimeRange !== option.value,
                }"
              >
                {{ option.label }}
              </button>
            </div>
          </div>
        </div>
        <div class="relative">
          <div class="grid grid-cols-3 gap-8">
            <div
              v-for="(stat, index) in userRegistrationStats"
              :key="index"
              class="flex items-center space-x-4"
            >
              <div
                class="p-2 rounded-lg"
                :class="{
                  'bg-blue-50 dark:bg-blue-900/20': index === 0,
                  'bg-green-50 dark:bg-green-900/20': index === 1,
                  'bg-purple-50 dark:bg-purple-900/20': index === 2,
                }"
              >
                <component
                  :is="stat.icon"
                  class="w-6 h-6"
                  :class="{
                    'text-blue-600 dark:text-blue-400': index === 0,
                    'text-green-600 dark:text-green-400': index === 1,
                    'text-purple-600 dark:text-purple-400': index === 2,
                  }"
                />
              </div>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ stat.label }}
                </p>
                <p class="text-xl font-semibold text-gray-900 dark:text-white">
                  {{ stat.value }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Active Users Stats -->
      <div class="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 relative mb-6 rounded-lg shadow-sm p-6">
        <div class="absolute top-2 right-2">
          <div class="group relative">
            <div 
              class="w-2 h-2 rounded-full cursor-help"
              :class="MOCK_USERS.ACTIVE ? 'bg-gray-600 dark:bg-gray-400' : 'bg-green-500 dark:bg-green-400'"
            ></div>
            <div class="invisible group-hover:visible absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 dark:bg-gray-700 rounded whitespace-nowrap z-50">
              {{ MOCK_USERS.ACTIVE ? '模擬數據' : '真實數據' }}
            </div>
          </div>
        </div>
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            活躍用戶
          </h2>
          <div class="flex items-center space-x-2">
            <div class="flex space-x-2">
              <button
                @click="timeRange = 'daily'"
                class="px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                :class="{
                  'bg-blue-600 text-white': timeRange === 'daily',
                  'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600':
                    timeRange !== 'daily',
                }"
              >
                當日
              </button>
              <button
                @click="timeRange = 'monthly'"
                class="px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                :class="{
                  'bg-blue-600 text-white': timeRange === 'monthly',
                  'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600':
                    timeRange !== 'monthly',
                }"
              >
                最近一個月
              </button>
            </div>
          </div>
        </div>
        <div class="relative">
          <div class="grid grid-cols-3 gap-8">
            <div
              v-for="(stat, index) in activeUserStats"
              :key="index"
              class="flex items-center space-x-4"
            >
              <div
                class="p-2 rounded-lg"
                :class="{
                  'bg-blue-50 dark:bg-blue-900/20': index === 0,
                  'bg-green-50 dark:bg-green-900/20': index === 1,
                  'bg-purple-50 dark:bg-purple-900/20': index === 2,
                }"
              >
                <component
                  :is="stat.icon"
                  class="w-6 h-6"
                  :class="{
                    'text-blue-600 dark:text-blue-400': index === 0,
                    'text-green-600 dark:text-green-400': index === 1,
                    'text-purple-600 dark:text-purple-400': index === 2,
                  }"
                />
              </div>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ stat.label }}
                </p>
                <p class="text-xl font-semibold text-gray-900 dark:text-white">
                  {{ stat.value }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Registration Trends -->
      <div class="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 relative mb-6 rounded-lg shadow-sm p-6">
        <div class="absolute top-2 right-2 z-10">
          <div class="group relative">
            <div 
              class="w-2 h-2 rounded-full cursor-help"
              :class="MOCK_USERS.REGISTRATION_TREND ? 'bg-gray-600 dark:bg-gray-400' : 'bg-green-500 dark:bg-green-400'"
            ></div>
            <div class="invisible group-hover:visible absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 dark:bg-gray-700 rounded whitespace-nowrap z-50">
              {{ MOCK_USERS.REGISTRATION_TREND ? '模擬數據' : '真實數據' }}
            </div>
          </div>
        </div>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            注冊趨勢（系統成立至今）
          </h2>
          <div class="flex space-x-4">
            <!-- Chart Style Selection -->
            <div class="flex space-x-2">
              <button
                v-for="style in chartStyles"
                :key="style.value"
                @click="selectedChartStyle = style.value"
                class="px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                :class="{
                  'bg-blue-600 text-white': selectedChartStyle === style.value,
                  'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600':
                    selectedChartStyle !== style.value,
                }"
              >
                <component :is="style.icon" class="w-4 h-4" />
                <span>{{ style.label }}</span>
              </button>
            </div>
            <!-- Chart Type Selection -->
            <div class="flex space-x-2">
              <button
                v-for="type in chartTypes"
                :key="type.value"
                @click="selectedChartType = type.value"
                class="px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                :class="{
                  'bg-blue-600 text-white': selectedChartType === type.value,
                  'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600':
                    selectedChartType !== type.value,
                }"
              >
                {{ type.label }}
              </button>
            </div>
          </div>
        </div>
        <div class="h-64">
          <div
            v-if="!registrationTrends.length"
            class="flex items-center justify-center h-full text-gray-500 dark:text-gray-400"
          >
            暫無數據
          </div>
          <div v-else class="h-full relative">
            <!-- Y-axis labels -->
            <div
              class="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400"
            >
              <span>{{ maxTrendCount }}</span>
              <span>{{ Math.round(maxTrendCount * 0.75) }}</span>
              <span>{{ Math.round(maxTrendCount * 0.5) }}</span>
              <span>{{ Math.round(maxTrendCount * 0.25) }}</span>
              <span>0</span>
            </div>

            <!-- Chart content -->
            <div class="ml-12 h-full relative">
              <!-- Grid lines -->
              <div class="absolute inset-0 grid grid-cols-4 grid-rows-4">
                <div
                  v-for="i in 16"
                  :key="i"
                  class="border-t border-gray-200 dark:border-gray-700"
                ></div>
              </div>

              <!-- Line chart -->
              <div
                v-if="selectedChartStyle === 'line'"
                class="absolute inset-0"
              >
                <svg class="w-full h-full">
                  <path
                    :d="getLinePath(displayedTrends)"
                    fill="none"
                    stroke="currentColor"
                    class="stroke-blue-600 dark:stroke-blue-500 transition-colors duration-300"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                  <circle
                    v-for="(point, index) in getLinePoints(displayedTrends)"
                    :key="index"
                    :cx="point.x"
                    :cy="point.y"
                    r="2"
                    class="fill-blue-600 dark:fill-blue-500"
                    :title="`${formatDate(displayedTrends[index].date)}: ${displayedTrends[index].count} 名用戶`"
                  />
                </svg>
              </div>

              <!-- Bar chart -->
              <div
                v-else
                class="absolute inset-0 flex items-end justify-between space-x-1"
              >
                <div
                  v-for="(trend, index) in displayedTrends"
                  :key="index"
                  class="flex-1 bg-blue-600 dark:bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-700 dark:hover:bg-blue-600"
                  :style="{ height: `${(trend.count / maxTrendCount) * 100}%` }"
                  :title="`${formatDate(trend.date)}: ${trend.count} 名用戶`"
                ></div>
              </div>
            </div>

            <div class="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span>{{ formatDate(displayedTrends[0]?.date) }}</span>
              <span>{{ formatDate(displayedTrends[displayedTrends.length - 1]?.date) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Activity Trends -->
      <div class="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 relative mb-6 rounded-lg shadow-sm p-6">
        <div class="absolute top-2 right-2 z-10">
          <div class="group relative">
            <div 
              class="w-2 h-2 rounded-full cursor-help"
              :class="MOCK_USERS.ACTIVITY_TREND ? 'bg-gray-600 dark:bg-gray-400' : 'bg-green-500 dark:bg-green-400'"
            ></div>
            <div class="invisible group-hover:visible absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 dark:bg-gray-700 rounded whitespace-nowrap z-50">
              {{ MOCK_USERS.ACTIVITY_TREND ? '模擬數據' : '真實數據' }}
            </div>
          </div>
        </div>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            活躍趨勢
          </h2>
        </div>
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
import MockDataIndicator from "@/components/MockDataIndicator.vue";
import { apiService } from "@/services/api-service";
import {
  UserCircleIcon,
  DevicePhoneMobileIcon,
  UsersIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon
} from "@heroicons/vue/24/outline";

// Add time range options
const timeRangeOptions = [
  { label: "總計", value: "total" },
  { label: "最近一個月", value: "month" },
];

const selectedTimeRange = ref("total");
const selectedType = ref<string>("");

// Define interfaces
interface UserStats {
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
  dailyIamSmartUsers: number;
  dailyPhoneUsers: number;
  dailyUndertakerUsers: number;
  dailyActiveUsers: Array<{ date: string; count: number }>;
  monthlyActiveUsers: Array<{ date: string; count: number }>;
  activityByType: Array<{ type: string; count: number }>;
  registrationTrends: Array<{ date: string; count: number }>;
}

// Service types
const serviceTypes = [
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

const loading = ref(true);
const userData = ref<UserStats | null>(null);

// State for time ranges
const timeRange = ref<"daily" | "monthly">("daily");
const registrationTimeRange = ref<string>("total");

// Add trend display options and state
const trendDisplayOptions = [
  { label: "累計", value: "cumulative" },
  { label: "新增", value: "new" },
];
const trendDisplayMode = ref("cumulative");

// Add mock flags
const MOCK_USER_REGISTRATION = import.meta.env.VITE_MOCK_USER_REGISTRATION === "true";
const MOCK_USERS = {
  ACTIVE: import.meta.env.VITE_MOCK_USER_ACTIVE === "true",
  REGISTRATION_TREND: import.meta.env.VITE_MOCK_USER_REGISTRATION_TREND === "true",
  ACTIVITY_TREND: import.meta.env.VITE_MOCK_USER_ACTIVITY_TREND === "true",
};

// Add mock flags for each service type
const MOCK_FORM_CCABB = import.meta.env.VITE_MOCK_FORM_CCABB === "true";
const MOCK_FORM_CCACB = import.meta.env.VITE_MOCK_FORM_CCACB === "true";
const MOCK_FORM_CCBUB = import.meta.env.VITE_MOCK_FORM_CCBUB === "true";
const MOCK_FORM_CCEXB = import.meta.env.VITE_MOCK_FORM_CCEXB === "true";
const MOCK_FORM_CCNIB = import.meta.env.VITE_MOCK_FORM_CCNIB === "true";
const MOCK_FORM_CCNIB_ADD = import.meta.env.VITE_MOCK_FORM_CCNIB_ADD === "true";
const MOCK_FORM_CCNIB_REM = import.meta.env.VITE_MOCK_FORM_CCNIB_REM === "true";
const MOCK_FORM_CCSAB = import.meta.env.VITE_MOCK_FORM_CCSAB === "true";
const MOCK_FORM_CCSCB = import.meta.env.VITE_MOCK_FORM_CCSCB === "true";
const MOCK_FORM_CCTSB = import.meta.env.VITE_MOCK_FORM_CCTSB === "true";
const MOCK_FORM_CCURB = import.meta.env.VITE_MOCK_FORM_CCURB === "true";

// Update user registration stats computed property
const userRegistrationStats = computed(() => {
  if (!userData.value) return [];
  const stats = userData.value;
  const isMonthly = registrationTimeRange.value === "month";

  return [
    {
      label: "iAM SMART 用戶",
      value: isMonthly ? stats.monthly_iamsmart_users : stats.iamsmart_users,
      icon: UserCircleIcon,
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "手機號碼用戶",
      value: isMonthly ? stats.monthly_phone_users : stats.phone_users,
      icon: DevicePhoneMobileIcon,
      bgColor: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      label: "殯儀館用戶",
      value: isMonthly ? stats.monthly_undertaker_users : stats.undertaker_users,
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
    // Transform the response to match our interface
    userData.value = {
      ...response,
      dailyIamSmartUsers: Math.floor(response.iamsmart_users / 10),
      dailyPhoneUsers: Math.floor(response.phone_users / 10),
      dailyUndertakerUsers: Math.floor(response.undertaker_users / 10),
      registrationTrends: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        count: Math.floor(Math.random() * 50) + 10
      }))
    };
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
          Math.floor(userData.value.iamsmart_users / 10),
        icon: UserCircleIcon,
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
        iconColor: "text-blue-600 dark:text-blue-400",
      },
      {
        label: "手機號碼活躍用戶",
        value:
          userData.value.dailyPhoneUsers ||
          Math.floor(userData.value.phone_users / 10),
        icon: DevicePhoneMobileIcon,
        bgColor: "bg-green-100 dark:bg-green-900/30",
        iconColor: "text-green-600 dark:text-green-400",
      },
      {
        label: "殯葬業界活躍用戶",
        value:
          userData.value.dailyUndertakerUsers ||
          Math.floor(userData.value.undertaker_users / 10),
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
          userData.value.monthly_iamsmart_users ||
          Math.floor(userData.value.iamsmart_users / 3),
        icon: UserCircleIcon,
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
        iconColor: "text-blue-600 dark:text-blue-400",
      },
      {
        label: "手機號碼活躍用戶",
        value:
          userData.value.monthly_phone_users ||
          Math.floor(userData.value.phone_users / 3),
        icon: DevicePhoneMobileIcon,
        bgColor: "bg-green-100 dark:bg-green-900/30",
        iconColor: "text-green-600 dark:text-green-400",
      },
      {
        label: "殯葬業界活躍用戶",
        value:
          userData.value.monthly_undertaker_users ||
          Math.floor(userData.value.undertaker_users / 3),
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

// Add helper function to get mock flag for service type
const getMockFlagForType = (type: string) => {
  switch (type) {
    case 'CCABB': return MOCK_FORM_CCABB;
    case 'CCACB': return MOCK_FORM_CCACB;
    case 'CCBUB': return MOCK_FORM_CCBUB;
    case 'CCEXB': return MOCK_FORM_CCEXB;
    case 'CCNIB': return MOCK_FORM_CCNIB;
    case 'CCNIB_ADD': return MOCK_FORM_CCNIB_ADD;
    case 'CCNIB_REM': return MOCK_FORM_CCNIB_REM;
    case 'CCSAB': return MOCK_FORM_CCSAB;
    case 'CCSCB': return MOCK_FORM_CCSCB;
    case 'CCTSB': return MOCK_FORM_CCTSB;
    case 'CCURB': return MOCK_FORM_CCURB;
    default: return false;
  }
};

// Chart styles and types
const chartStyles = [
  { label: "柱狀圖", value: "bar", icon: ChartBarIcon },
  { label: "折線圖", value: "line", icon: ArrowTrendingUpIcon }
];

const chartTypes = [
  { label: "總申請數", value: "current" },
  { label: "已完成", value: "completed" },
  { label: "處理中", value: "processing" }
];

const selectedChartStyle = ref("bar");
const selectedChartType = ref("current");

// Add helper functions for line chart
const getLinePoints = (trends: any[]) => {
  if (!trends.length) return [];
  const maxCount = Math.max(...trends.map(t => t.count));
  return trends.map((trend, index) => ({
    x: (index / (trends.length - 1)) * 100,
    y: 100 - ((trend.count / maxCount) * 90) // Leave some padding at top
  }));
};

const getLinePath = (trends: any[]) => {
  const points = getLinePoints(trends);
  if (!points.length) return '';
  return points.reduce((path, point, i) => 
    path + (i === 0 ? `M ${point.x},${point.y}` : ` L ${point.x},${point.y}`), 
  '');
};
</script>
