<template>
  <div class="group relative">
    <div 
      class="w-2 h-2 rounded-full cursor-help"
      :class="isMockData ? 'bg-gray-600 dark:bg-gray-400' : 'bg-green-500 dark:bg-green-400'"
    ></div>
    <div class="invisible group-hover:visible absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 dark:bg-gray-700 rounded whitespace-nowrap z-50">
      {{ isMockData ? '模擬數據' : '真實數據' }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isMockData: boolean;
}>();
</script> 