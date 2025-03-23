<template>
  <div class="min-h-screen flex flex-col" :class="{ dark: isDarkMode }">
    <header
      class="bg-white dark:bg-gray-800 shadow-md py-4 px-6 flex items-center justify-between"
    >
      <div class="flex items-center">
        <h1 class="text-xl font-bold text-blue-600 dark:text-blue-400">
          CCSP Dashboard - 墳場及火葬場服務
        </h1>
      </div>
      <div class="flex items-center gap-4">
        <button
          @click="toggleDarkMode"
          class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <svg
            v-if="isDarkMode"
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-yellow-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        </button>
        <button
          @click="refreshData"
          class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-blue-600 dark:text-blue-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden">
      <aside
        class="w-64 bg-white dark:bg-gray-800 shadow-md p-4 hidden md:block"
      >
        <nav>
          <ul class="space-y-2">
            <li>
              <RouterLink
                to="/"
                class="block px-4 py-2 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900 text-gray-700 dark:text-gray-200"
                :class="{
                  'bg-blue-100 dark:bg-blue-900 font-medium':
                    $route.path === '/',
                }"
              >
                儀表板
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/forms"
                class="block px-4 py-2 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900 text-gray-700 dark:text-gray-200"
                :class="{
                  'bg-blue-100 dark:bg-blue-900 font-medium':
                    $route.path === '/forms',
                }"
              >
                申請表格
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/users"
                class="block px-4 py-2 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900 text-gray-700 dark:text-gray-200"
                :class="{
                  'bg-blue-100 dark:bg-blue-900 font-medium':
                    $route.path === '/users',
                }"
              >
                用戶活動
              </RouterLink>
            </li>
          </ul>
        </nav>
      </aside>

      <main class="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";

const isDarkMode = ref(localStorage.getItem("darkMode") === "true");
const route = useRoute();

function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem("darkMode", isDarkMode.value.toString());
}

function refreshData() {
  // Emit a global event that components can listen to for refreshing data
  window.dispatchEvent(new CustomEvent("refresh-dashboard-data"));
}
</script>
