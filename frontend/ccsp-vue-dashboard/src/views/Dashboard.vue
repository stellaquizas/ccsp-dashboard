<template>
  <div class="p-6">
    <!-- Main Title -->
    <h1 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
      系統概括
    </h1>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"
      ></div>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- User Statistics -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700 mb-6"
      >
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            用戶注冊總數
          </h2>
          <div class="flex space-x-2">
            <button
              v-for="option in timeRangeOptions"
              :key="option.value"
              @click="selectedTimeRange = option.value"
              class="px-3 py-1 rounded-lg text-sm font-medium transition-colors"
              :class="{
                'bg-blue-600 text-white': selectedTimeRange === option.value,
                'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600':
                  selectedTimeRange !== option.value,
              }"
            >
              {{ option.label }}
            </button>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <div
            v-for="(stat, index) in userStatsDisplay"
            :key="index"
            class="flex items-center space-x-3"
          >
            <div
              class="p-2 rounded-full"
              :class="{
                'bg-blue-100 dark:bg-blue-900': index === 0,
                'bg-green-100 dark:bg-green-900': index === 1,
                'bg-purple-100 dark:bg-purple-900': index === 2,
              }"
            >
              <component
                :is="stat.icon"
                class="w-6 h-6"
                :class="{
                  'text-blue-600 dark:text-blue-300': index === 0,
                  'text-green-600 dark:text-green-300': index === 1,
                  'text-purple-600 dark:text-purple-300': index === 2,
                }"
              />
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                {{ stat.label }}
              </p>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ stat.value }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Application Statistics -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700 mb-6"
      >
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          申請統計
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            v-for="(stat, index) in applicationStatsDisplay"
            :key="index"
            class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
          >
            <div class="flex items-center space-x-3">
              <div class="p-2 rounded-full" :class="stat.bgColor">
                <component
                  :is="stat.icon"
                  class="w-6 h-6"
                  :class="stat.iconColor"
                />
              </div>
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-300">
                  {{ stat.label }}
                </p>
                <p class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ stat.value }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Application Trend Chart -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700"
      >
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            申請趨勢
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
        <div class="h-64 relative">
          <div
            v-if="!applicationTrends.length"
            class="flex items-center justify-center h-full text-gray-500 dark:text-gray-400"
          >
            暫無數據
          </div>
          <div v-else class="h-full">
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
                  v-for="i in chartConfig.grid.lines"
                  :key="i"
                  class="border-t border-gray-200 dark:border-gray-700"
                ></div>
              </div>

              <!-- Line chart connecting lines -->
              <div
                v-if="selectedChartStyle === 'line'"
                class="absolute inset-0"
              >
                <svg class="w-full h-full">
                  <path
                    :d="getLinePath"
                    fill="none"
                    :stroke="getChartColor"
                    :stroke-width="chartConfig.line.lineWidth"
                    class="transition-colors duration-300"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>

              <!-- Data points -->
              <div class="absolute inset-0">
                <div
                  v-for="(trend, index) in filteredTrends"
                  :key="index"
                  class="absolute transition-all duration-300 group"
                  :style="getChartStyle(trend, index)"
                >
                  <div
                    class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg"
                  >
                    <div class="font-medium">{{ formatDate(trend.date) }}</div>
                    <div class="text-xs opacity-75">{{ trend.count }} 宗</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- X-axis labels -->
            <div
              class="ml-12 mt-2 flex justify-between text-xs text-gray-500 dark:text-gray-400"
            >
              <span>{{ formatDate(applicationTrends[0]?.date) }}</span>
              <span>{{
                formatDate(
                  applicationTrends[applicationTrends.length - 1]?.date
                )
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
  UserIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  ChartBarSquareIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/vue/24/outline";

// Define interfaces
interface UserStats {
  iamSmartUsers: number;
  phoneUsers: number;
  undertakerUsers: number;
  monthlyIamSmartUsers: number;
  monthlyPhoneUsers: number;
  monthlyUndertakerUsers: number;
}

interface ApplicationStats {
  totalApplications: number;
  pendingApplications: number;
  completedApplications: number;
  unprocessedApplications: number;
}

interface ApplicationTrend {
  date: string;
  total: number;
  completed: number;
  pending: number;
}

const loading = ref(true);
const userStats = ref<UserStats | null>(null);
const applicationStats = ref<ApplicationStats | null>(null);
const applicationTrends = ref<ApplicationTrend[]>([]);
const selectedChartType = ref<"total" | "completed" | "pending">("total");
const selectedChartStyle = ref<"bar" | "line">("bar");

// Add time range options
const timeRangeOptions = [
  { label: "總計", value: "total" },
  { label: "最近一個月", value: "month" },
];

const selectedTimeRange = ref("total");

const chartTypes = [
  { label: "總申請數", value: "total" },
  { label: "已完成", value: "completed" },
  { label: "處理中", value: "pending" },
];

const chartStyles = [
  { label: "柱狀圖", value: "bar", icon: ChartBarIcon },
  { label: "折線圖", value: "line", icon: ChartBarSquareIcon },
];

// Update chart configuration
const chartConfig = {
  bar: {
    width: 16,
    spacing: 8,
    radius: 4,
    hoverScale: 1.1,
  },
  line: {
    pointSize: 6,
    lineWidth: 2,
    spacing: 8,
    hoverScale: 1.2,
  },
  grid: {
    lines: 4,
    color: "#e5e7eb",
    darkColor: "#374151",
  },
  axis: {
    fontSize: "0.75rem",
    color: "#6b7280",
    darkColor: "#9ca3af",
  },
};

// Update userStatsDisplay computed property
const userStatsDisplay = computed(() => {
  if (!userStats.value) return [];
  const stats = userStats.value;
  const isMonthly = selectedTimeRange.value === "month";

  return [
    {
      label: "iAM SMART 用戶",
      value: isMonthly ? stats.monthlyIamSmartUsers : stats.iamSmartUsers,
      icon: UserIcon,
    },
    {
      label: "手機號碼用戶",
      value: isMonthly ? stats.monthlyPhoneUsers : stats.phoneUsers,
      icon: PhoneIcon,
    },
    {
      label: "殯儀館用戶",
      value: isMonthly ? stats.monthlyUndertakerUsers : stats.undertakerUsers,
      icon: BuildingOfficeIcon,
    },
  ];
});

const applicationStatsDisplay = computed(() => {
  return [
    {
      label: "總申請數",
      value: applicationStats.value?.totalApplications || 0,
      icon: DocumentTextIcon,
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "已遞交",
      value: applicationStats.value?.unprocessedApplications || 0,
      icon: ClockIcon,
      bgColor: "bg-red-100 dark:bg-red-900/30",
      iconColor: "text-red-600 dark:text-red-400",
    },
    {
      label: "處理中",
      value: applicationStats.value?.pendingApplications || 0,
      icon: ClipboardDocumentCheckIcon,
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
      iconColor: "text-yellow-600 dark:text-yellow-400",
    },
    {
      label: "已完成",
      value: applicationStats.value?.completedApplications || 0,
      icon: CheckCircleIcon,
      bgColor: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
    },
  ];
});

const filteredTrends = computed(() => {
  return applicationTrends.value.map((trend) => ({
    date: trend.date,
    count: trend[selectedChartType.value],
  }));
});

const maxTrendCount = computed(() => {
  if (!filteredTrends.value.length) return 0;
  return Math.max(...filteredTrends.value.map((trend) => trend.count));
});

// Format date for display
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

// Add computed properties for chart
const getChartColor = computed(() => {
  switch (selectedChartType.value) {
    case "total":
      return "#2563eb"; // blue-600
    case "completed":
      return "#16a34a"; // green-600
    case "pending":
      return "#ca8a04"; // yellow-600
    default:
      return "#2563eb";
  }
});

// Update chart computed properties
const chartDimensions = computed(() => {
  const containerWidth = 800; // Approximate width of chart container
  const containerHeight = 256; // 64 * 4 (h-64)
  const yAxisWidth = 48; // w-12
  const xAxisHeight = 24; // mt-2
  const padding = 16; // p-4

  return {
    width: containerWidth - yAxisWidth - padding * 2,
    height: containerHeight - xAxisHeight - padding * 2,
    yAxisWidth,
    xAxisHeight,
    padding,
  };
});

const getLinePath = computed(() => {
  if (!filteredTrends.value.length) return "";

  const { width, height, padding } = chartDimensions.value;
  const points = filteredTrends.value.map((trend, index) => {
    const x = padding + (index / (filteredTrends.value.length - 1)) * width;
    const y = height + padding - (trend.count / maxTrendCount.value) * height;
    return `${x},${y}`;
  });

  return `M ${points.join(" L ")}`;
});

const getChartStyle = (trend: { count: number }, index: number) => {
  const { width, height, padding } = chartDimensions.value;
  const x = padding + (index / (filteredTrends.value.length - 1)) * width;
  const y = height + padding - (trend.count / maxTrendCount.value) * height;

  if (selectedChartStyle.value === "line") {
    return {
      position: "absolute",
      left: `${x - chartConfig.line.pointSize / 2}px`,
      top: `${y - chartConfig.line.pointSize / 2}px`,
      width: `${chartConfig.line.pointSize}px`,
      height: `${chartConfig.line.pointSize}px`,
      borderRadius: "50%",
      backgroundColor: getChartColor.value,
      transform: "translate(-50%, -50%)",
      transition: "all 0.3s ease",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      "&:hover": {
        transform: "translate(-50%, -50%) scale(1.2)",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
      },
    };
  }

  return {
    position: "absolute",
    left: `${x - chartConfig.bar.width / 2}px`,
    bottom: `${padding}px`,
    width: `${chartConfig.bar.width}px`,
    height: `${(trend.count / maxTrendCount.value) * height}px`,
    borderRadius: `${chartConfig.bar.radius}px ${chartConfig.bar.radius}px 0 0`,
    backgroundColor: getChartColor.value,
    transition: "all 0.3s ease",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    "&:hover": {
      transform: "scaleY(1.1)",
      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    },
  };
};

// Fetch data from API
const fetchData = async () => {
  try {
    loading.value = true;
    const [
      userStatsResponse,
      applicationStatsResponse,
      applicationTrendsResponse,
    ] = await Promise.all([
      apiService.getUserStats(),
      apiService.getApplicationStats(),
      apiService.getApplicationTrends(),
    ]);
    userStats.value = userStatsResponse;
    applicationStats.value = applicationStatsResponse;
    applicationTrends.value = applicationTrendsResponse;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  } finally {
    loading.value = false;
  }
};

// Initial data fetch
onMounted(() => {
  fetchData();
});

// Listen for refresh events
window.addEventListener("refresh-dashboard", fetchData);
</script>
