<template>
  <div class="p-6">
    <!-- Main Title -->
    <h1 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
      各項申請
    </h1>

    <!-- Application Type Filter -->
    <div class="mb-6">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="type in applicationTypes"
          :key="type.code"
          @click="selectedType = type.code"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="{
            'bg-blue-600 text-white': selectedType === type.code,
            'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600':
              selectedType !== type.code,
          }"
        >
          {{ type.name }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"
      ></div>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Status Breakdown -->
      <div
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2 mb-6"
      >
        <div
          v-for="(status, index) in orderedStatusBreakdown"
          :key="index"
          class="bg-white dark:bg-gray-800 rounded-lg shadow p-3 border border-gray-200 dark:border-gray-700 relative"
          :class="{
            'border-red-500 dark:border-red-500 border-2':
              status.name === '申請被拒' ||
              status.name === '批核無效' ||
              status.name === '過期預備移除' ||
              status.name === '過期已移除' ||
              status.name === '申請無效',
          }"
        >
          <div>
            <p
              class="text-sm font-medium text-gray-600 dark:text-gray-300 truncate"
            >
              {{ status.name }}
              <span class="text-xs text-gray-500 dark:text-gray-400"
                >({{ getStatusCode(status.name) }})</span
              >
            </p>
            <p class="text-xl font-semibold text-gray-900 dark:text-white mt-1">
              {{ status.count }}
            </p>
          </div>
        </div>
      </div>

      <!-- Processing Time Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div
          class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700"
        >
          <h3 class="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            平均完成時間
          </h3>
          <p class="text-2xl font-semibold text-gray-900 dark:text-white">
            {{ avgProcessingTime }} 天
          </p>
        </div>
        <div
          class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700"
        >
          <h3 class="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            最長完成時間
          </h3>
          <p class="text-2xl font-semibold text-gray-900 dark:text-white">
            {{ maxProcessingTime }} 天
          </p>
        </div>
      </div>

      <!-- Application Trends -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700"
      >
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          申請趨勢
        </h2>
        <div class="h-64">
          <div
            v-if="!trends.length"
            class="flex items-center justify-center h-full text-gray-500 dark:text-gray-400"
          >
            暫無數據
          </div>
          <div v-else class="h-full">
            <div class="h-full flex items-end justify-between space-x-1">
              <div
                v-for="(trend, index) in trends"
                :key="index"
                class="flex-1 bg-blue-600 dark:bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-700 dark:hover:bg-blue-600"
                :style="{ height: `${(trend.count / maxTrendCount) * 100}%` }"
                :title="`${formatDate(trend.date)}: ${trend.count} 宗`"
              ></div>
            </div>
            <div
              class="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400"
            >
              <span>{{ formatDate(trends[0]?.date) }}</span>
              <span>{{ formatDate(trends[trends.length - 1]?.date) }}</span>
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

// Application types based on ccsp_service_code
const applicationTypes: ApplicationType[] = [
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
const trends = ref<any[]>([]);
const selectedApplication = ref<Application | null>(null);

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

// Add maxTrendCount computed property
const maxTrendCount = computed(() => {
  if (!trends.value.length) return 0;
  return Math.max(...trends.value.map((trend) => trend.count));
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
  const statusOrder = {
    DFT: 1, // Draft status should be first
    PEN: 2, // Pending
    PRO: 3, // Processing
    COM: 4, // Completed
    REJ: 5, // Rejected
    CAN: 6, // Cancelled
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
      trends.value = response.trends || [];
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
</script>
