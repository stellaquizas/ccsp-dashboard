<template>
  <div class="forms">
    <h1 class="text-2xl font-bold mb-6">墳場及火葬場服務申請表格</h1>

    <div class="bg-white rounded-lg shadow p-6">
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white">
          <thead>
            <tr class="border-b">
              <th class="py-3 px-4 text-left font-semibold">表格編號</th>
              <th class="py-3 px-4 text-left font-semibold">表格名稱</th>
              <th class="py-3 px-4 text-left font-semibold">總申請數</th>
              <th class="py-3 px-4 text-left font-semibold">網上申請</th>
              <th class="py-3 px-4 text-left font-semibold">紙本申請</th>
              <th class="py-3 px-4 text-left font-semibold">連結</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading" class="border-b">
              <td colspan="6" class="py-4 px-4 text-center text-gray-500">
                加載中...
              </td>
            </tr>
            <tr v-else-if="forms.length === 0" class="border-b">
              <td colspan="6" class="py-4 px-4 text-center text-gray-500">
                沒有表格數據
              </td>
            </tr>
            <tr
              v-else
              v-for="form in forms"
              :key="form.form_id"
              class="border-b hover:bg-gray-50"
            >
              <td class="py-3 px-4">{{ form.form_id }}</td>
              <td class="py-3 px-4">{{ form.name }}</td>
              <td class="py-3 px-4">{{ form.submission_count }}</td>
              <td class="py-3 px-4">{{ form.online_count }}</td>
              <td class="py-3 px-4">{{ form.paper_count }}</td>
              <td class="py-3 px-4">
                <div class="flex gap-2">
                  <a
                    v-if="form.url"
                    :href="form.url"
                    target="_blank"
                    class="text-blue-600 hover:underline"
                  >
                    網上表格
                  </a>
                  <a
                    v-if="form.pdf_url"
                    :href="form.pdf_url"
                    target="_blank"
                    class="text-blue-600 hover:underline"
                  >
                    PDF
                  </a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { apiService } from "../services/api-service";

// Define interface for form data
interface Form {
  form_id: string;
  name: string;
  url: string;
  pdf_url: string;
  submission_count: number;
  online_count: number;
  paper_count: number;
}

// Set up reactive data
const forms = ref<Form[]>([]);
const loading = ref(true);

// Fetch forms data from API
const fetchForms = async () => {
  try {
    loading.value = true;
    const response = await apiService.getForms();
    forms.value = response;
  } catch (error) {
    console.error("Error fetching forms data:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchForms();
});
</script>
