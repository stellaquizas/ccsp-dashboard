<template>
  <div class="p-6">
    <!-- Main Title -->
    <h1 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
      各項申請
    </h1>

    <!-- Application Type Filter -->
    <div class="mb-6">
      <div class="flex flex-wrap gap-2">
        <div v-for="type in applicationTypes" :key="type.code">
          <button
            @click="selectedType = type.code"
            class="px-6 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 min-w-[160px] justify-between"
            :class="{
              'bg-blue-600 text-white': selectedType === type.code,
              'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600':
                selectedType !== type.code,
            }"
          >
            <span class="truncate">{{ type.name }}</span>
            <div class="flex-shrink-0 group relative">
              <div class="p-1 cursor-help">
                <div 
                  class="w-3 h-3 rounded-full"
                  :class="[
                    getMockFlagForType(type.code) ? 
                    'bg-gray-600 dark:bg-gray-400' : 
                    'bg-green-500 dark:bg-green-400'
                  ]"
                ></div>
              </div>
              <div class="invisible group-hover:visible absolute -top-8 right-0 px-2 py-1 text-xs bg-gray-900 text-white rounded shadow-lg whitespace-nowrap z-50 min-w-[4rem] text-center">
                {{ getMockFlagForType(type.code) ? '模擬數據' : '真實數據' }}
                <div class="absolute bottom-0 right-2 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"
      ></div>
    </div>

    <!-- Main Content -->
    <div v-else class="space-y-6">
      <!-- Status Grid -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div v-for="status in orderedStatusBreakdown" :key="getStatusCode(status.name)" 
          class="p-4 rounded-lg shadow-sm transition-colors"
          :class="[
            getMockFlagForType(selectedType) ? 
            'bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700' : 
            'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
            {
              'border-red-500 dark:border-red-500 border-2':
                status.name === '申請被拒' ||
                status.name === '批核無效' ||
                status.name === '過期預備移除' ||
                status.name === '過期已移除' ||
                status.name === '申請無效',
            }
          ]"
        >
          <div class="flex flex-col">
            <div class="flex items-center gap-1">
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ status.name }}</span>
              <span class="text-xs text-gray-500 dark:text-gray-400">({{ getStatusCode(status.name) }})</span>
            </div>
            <span class="text-2xl font-semibold text-gray-900 dark:text-white">{{ status.count }}</span>
          </div>
        </div>
      </div>

      <!-- Time Processing Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 rounded-lg shadow-sm transition-colors"
          :class="[
            getMockFlagForType(selectedType) ? 
            'bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700' : 
            'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
          ]"
        >
          <span class="text-sm text-gray-500 dark:text-gray-400">平均完成時間</span>
          <div class="text-2xl font-semibold text-gray-900 dark:text-white">
            {{ avgProcessingTime }} 天
          </div>
        </div>
        <div class="p-4 rounded-lg shadow-sm transition-colors"
          :class="[
            getMockFlagForType(selectedType) ? 
            'bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700' : 
            'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
          ]"
        >
          <span class="text-sm text-gray-500 dark:text-gray-400">最長完成時間</span>
          <div class="text-2xl font-semibold text-gray-900 dark:text-white">
            {{ maxProcessingTime }} 天
          </div>
        </div>
      </div>

      <!-- Application Trend Chart -->
      <div class="rounded-lg shadow-sm transition-colors"
        :class="[
          getMockFlagForType(selectedType) ? 
          'bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700' : 
          'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
        ]"
      >
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">申請趨勢</h3>
            <div class="flex gap-4">
              <!-- Chart Type Selection -->
              <div class="flex gap-2">
                <button
                  v-for="option in chartTypes"
                  :key="option.value"
                  @click="selectedChartType = option.value"
                  class="px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                  :class="{
                    'bg-blue-600 text-white': selectedChartType === option.value,
                    'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600':
                      selectedChartType !== option.value,
                  }"
                >
                  {{ option.label }}
                </button>
              </div>
              <!-- Data Type Selection -->
              <div class="flex gap-2">
                <button
                  v-for="option in dataTypes"
                  :key="option.value"
                  @click="selectedDataType = option.value"
                  class="px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                  :class="{
                    'bg-blue-600 text-white': selectedDataType === option.value,
                    'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600':
                      selectedDataType !== option.value,
                  }"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="p-4">
          <div class="h-64">
            <div
              v-if="!trends.length"
              class="flex items-center justify-center h-full text-gray-500 dark:text-gray-400"
            >
              暫無數據
            </div>
            <div v-else class="h-full">
              <!-- Line Chart -->
              <div v-if="selectedChartType === 'line'" class="h-full">
                <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path
                    :d="getLinePath(filteredTrends)"
                    class="stroke-blue-600 dark:stroke-blue-500 fill-none stroke-2"
                  />
                  <circle
                    v-for="(point, index) in getLinePoints(filteredTrends)"
                    :key="index"
                    :cx="point.x"
                    :cy="point.y"
                    r="0.5"
                    class="fill-blue-600 dark:fill-blue-500"
                    :title="`${formatDate(filteredTrends[index].date)}: ${filteredTrends[index].count} 宗`"
                  />
                </svg>
              </div>

              <!-- Bar Chart -->
              <div v-else class="h-full flex items-end justify-between space-x-1">
                <div
                  v-for="(trend, index) in filteredTrends"
                  :key="index"
                  class="flex-1 bg-blue-600 dark:bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-700 dark:hover:bg-blue-600"
                  :style="{ height: `${(trend.count / maxTrendCount) * 100}%` }"
                  :title="`${formatDate(trend.date)}: ${trend.count} 宗`"
                ></div>
              </div>

              <div class="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span>{{ formatDate(filteredTrends[0]?.date) }}</span>
                <span>{{ formatDate(filteredTrends[filteredTrends.length - 1]?.date) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { apiService } from "../services/api-service";
import {
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  CurrencyDollarIcon,
  XMarkIcon,
  ArrowPathIcon,
  UserIcon,
} from "@heroicons/vue/24/outline";
import MockDataIndicator from "@/components/MockDataIndicator.vue";

// Define interfaces
interface ApplicationType {
  code: string;
  name: string;
}

interface Application {
  id: string;
  type: string;
  status: string;
  submissionDate: string;
  processingTime: number;
}

interface StatusBreakdown {
  name: string;
  count: number;
}

// Add trend interface
interface Trend {
  date: string;
  count: number;
  completedCount: number;
  processingCount: number;
}

// Application types based on ccsp_service_code
const applicationTypes: ApplicationType[] = [
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

// Status mapping based on ccsp_system_code table
const statusMapping: Record<string, { text: string; color: string }> = {
  // ABB statuses
  DFT: { text: "已遞交", color: "red" },
  AP_DFT: { text: "處理中", color: "yellow" },
  RJ_DFT: { text: "申請被拒", color: "red" },
  REP: { text: "處理中", color: "yellow" },
  APP: { text: "已獲批准", color: "blue" },
  RJP: { text: "申請被拒", color: "red" },
  CIN: { text: "已完成", color: "green" },
  RIN: { text: "已取消安放", color: "gray" },

  // ACB statuses
  // Most covered by ABB

  // BU statuses
  BOK: { text: "已付款", color: "blue" },
  CAP: { text: "已取消申請", color: "gray" },
  CNR: { text: "取消付款", color: "orange" },

  // NI statuses
  AD_DFT: { text: "已遞交", color: "gray" },
  RJ_AD: { text: "申請被拒", color: "red" },
  AP_AD: { text: "處理中", color: "yellow" },
  CNP: { text: "批核無效", color: "red" },
  COT: { text: "已移除", color: "green" },
  RJM: { text: "申請被拒", color: "red" },
  CNF: { text: "申請無效", color: "red" },
  REM: { text: "申請移除", color: "orange" },
  APM: { text: "已獲批准取回", color: "blue" },
  RLS: { text: "釋放龕位", color: "green" },
  CNM: { text: "批核無效", color: "red" },
  MAP: { text: "需親自辦理", color: "yellow" },

  // TS statuses
  RCI: { text: "待處理", color: "yellow" },
  RCO: { text: "待取回", color: "yellow" },
  ERM: { text: "過期預備移除", color: "red" },
  ECT: { text: "過期已移除", color: "red" },
};

const loading = ref(true);
const selectedType = ref<string>(applicationTypes[0].code);
const applications = ref<Application[]>([]);
const statusBreakdown = ref<StatusBreakdown[]>([]);
const avgProcessingTime = ref(0);
const maxProcessingTime = ref(0);
const trends = ref<Trend[]>([]);
const selectedApplication = ref<Application | null>(null);

// Chart type options
const chartTypes = [
  { label: "柱狀圖", value: "bar" },
  { label: "折線圖", value: "line" }
];

// Data type options
const dataTypes = [
  { label: "總申請數", value: "current" },
  { label: "已完成", value: "completed" },
  { label: "處理中", value: "processing" }
];

const selectedChartType = ref("bar");
const selectedDataType = ref("current");

// Update filteredTrends computed property to use selectedDataType
const filteredTrends = computed(() => {
  if (!trends.value || !trends.value.length) return [];

  switch (selectedDataType.value) {
    case 'completed':
      return trends.value.map((trend: Trend) => ({
        ...trend,
        count: trend.completedCount
      }));
    case 'processing':
      return trends.value.map((trend: Trend) => ({
        ...trend,
        count: trend.processingCount
      }));
    case 'current':
    default:
      return trends.value.map((trend: Trend) => ({
        ...trend,
        count: trend.count
      }));
  }
});

// Get status text and color
const getStatusInfo = (status: string) => {
  // Find the status in the statusMapping by text
  for (const [code, info] of Object.entries(statusMapping)) {
    if (info.text === status) {
      return info;
    }
  }

  // Fallback for direct code lookup
  return statusMapping[status] || { text: status, color: "gray" };
};

// Update maxTrendCount computed property
const maxTrendCount = computed(() => {
  if (!filteredTrends.value.length) return 0;
  return Math.max(...filteredTrends.value.map((trend) => trend.count || 0));
});

// Add function to get status code
const getStatusCode = (statusName: string): string => {
  for (const [code, status] of Object.entries(statusMapping)) {
    if (status.text === statusName) {
      return code;
    }
  }
  return "";
};

// Add a computed property to order the statusBreakdown
const orderedStatusBreakdown = computed(() => {
  if (!statusBreakdown.value) return [];

  // Sort by a predefined order
  const statusOrder: Record<string, number> = {
    DFT: 1, // Draft status should be first
    AP_DFT: 2, 
    RJ_DFT: 3, 
    APP: 4,
    BOK: 5, 
    CAP: 6, 
    CIN: 7, 
  };

  return [...statusBreakdown.value].sort((a, b) => {
    const codeA = getStatusCode(a.name) || "";
    const codeB = getStatusCode(b.name) || "";
    return (statusOrder[codeA] || 999) - (statusOrder[codeB] || 999);
  });
});

// Update fetchApplications to handle errors better
const fetchApplications = async (type?: string) => {
  try {
    loading.value = true;
    const response = await apiService.getApplications(type);
    if (response) {
      applications.value = response.applications || [];
      statusBreakdown.value = response.statusBreakdown || [];
      avgProcessingTime.value = response.avgProcessingTime || 0;
      maxProcessingTime.value = response.maxProcessingTime || 0;
      trends.value = response.trends?.map((trend: any) => ({
        date: new Date(trend.date).toISOString(),
        count: trend.count || 0,
        completedCount: trend.completedCount || 0,
        processingCount: trend.processingCount || 0
      })) || [];
    }
  } catch (error) {
    console.error("Error fetching applications:", error);
    // Set default values on error
    applications.value = [];
    statusBreakdown.value = [];
    avgProcessingTime.value = 0;
    maxProcessingTime.value = 0;
    trends.value = [];
  } finally {
    loading.value = false;
  }
};

// Update onMounted to fetch with the selected type
onMounted(async () => {
  await fetchApplications(selectedType.value);
  if (applications.value.length > 0) {
    selectedApplication.value = applications.value[0];
  }
});

// Watch for type changes
watch(selectedType, (newType) => {
  fetchApplications(newType || undefined);
});

// Listen for refresh events
window.addEventListener("refresh-dashboard", () => {
  fetchApplications(selectedType.value || undefined);
});

// Format date
const formatDate = (date: string) => {
  const formattedDate = new Date(date).toLocaleDateString();
  return formattedDate;
};

// Add status icons mapping to match updated status texts
const statusIcons: Record<string, any> = {
  // Common status icons
  未處理: DocumentTextIcon,
  已遞交: DocumentTextIcon,
  處理中: ClockIcon,
  待處理: ClockIcon,
  已獲批准: CheckCircleIcon,
  已獲批准取回: CheckCircleIcon,
  申請被拒: ExclamationTriangleIcon,
  取消付款: XCircleIcon,
  已付款: CurrencyDollarIcon,
  已取消申請: XMarkIcon,
  已完成: CheckCircleIcon,
  已移除: CheckCircleIcon,
  已取回: ArrowPathIcon,
  已取消安放: XMarkIcon,
  待取回: ArrowPathIcon,
  過期預備移除: ExclamationTriangleIcon,
  過期已移除: XMarkIcon,
  申請移除: ArrowPathIcon,
  釋放龕位: CheckCircleIcon,
  批核無效: XCircleIcon,
  申請無效: XCircleIcon,
  需親自辦理: UserIcon,
};

// Add helper function to get status icon
const getStatusIcon = (statusName: string) => {
  return statusIcons[statusName] || DocumentTextIcon;
};

// Mock data flags
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

// Helper function to get mock flag for a specific type
const getMockFlagForType = (type: string): boolean => {
  return MOCK_FORMS[type as keyof typeof MOCK_FORMS] || false;
};

// Add helper functions for line chart
const getLinePoints = (trends: Trend[]) => {
  if (!trends.length) return [];
  const maxCount = Math.max(...trends.map(t => t.count));
  return trends.map((trend, index) => ({
    x: (index / (trends.length - 1)) * 100,
    y: 100 - ((trend.count / maxCount) * 90) // Leave some padding at top
  }));
};

const getLinePath = (trends: Trend[]) => {
  const points = getLinePoints(trends);
  if (!points.length) return '';
  return points.reduce((path, point, i) => 
    path + (i === 0 ? `M ${point.x},${point.y}` : ` L ${point.x},${point.y}`), 
  '');
};
</script>
