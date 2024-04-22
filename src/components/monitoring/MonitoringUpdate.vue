<template>
  <MonitoringForm
    v-show="!loading"
    :header="'Modification d\'un suivi'"
    :monitoringToUpdate="selectedMonitoring"
    :apiErrors="apiErrors"
    :loading="loadingForm"
    :submitButtonLabel="$t('button.update')"
    @submit="updateMonitoring"
    @quit="quit()"
  />
  <LoadingSpinner v-if="loading" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import monitoringService from "@/services/MonitoringService";
import type { ApiError } from "@/models/ApiError";
import responseService from "@/services/ResponseService";
import MonitoringForm from "@/components/monitoring/MonitoringForm.vue";
import type { Monitoring } from "@/models/Monitoring";
import monitoringScript from "@/scripts/MonitoringScript";
import router from "@/router";
import LoadingSpinner from "@/components/common/LoadingSpinner.vue";
import { onMounted } from "vue";
import { useMonitoringStore } from "@/stores/monitoring";

const monitoringStore = useMonitoringStore();

const apiErrors = ref([] as ApiError[]);
const loadingForm = ref(false);
const selectedMonitoring = ref(monitoringScript.init());
const loading = ref(true);
const props = defineProps({
  id: {
    default: 0,
  },
});

onMounted(async () => {
  selectedMonitoring.value = await monitoringService.getMonitoring(props.id);
  loading.value = false;
});

async function updateMonitoring(monitoring: Monitoring) {
  try {
    loadingForm.value = true;
    const isUpdated = await monitoringService.updateMonitoring(monitoring);
    if (!isUpdated) {
      apiErrors.value = [
        { message: "Impossible de modifier le suivi", code: "", level: "error" },
      ];
    } else {
      monitoringStore.updateMonitoring(monitoring);
      quit();
    }
  } catch (error: any) {
    apiErrors.value = responseService.getApiErrors(error);
  }
  loadingForm.value = false;
}

function quit() {
  router.go(-1);
}
</script>
