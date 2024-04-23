<template>
  <div>
    <MonitoringLineForm
      v-show="!loading"
      :header="$t('monitoringLine.updateTitle')"
      :monitoringLineToUpdate="monitoringLine"
      :apiErrors="apiErrors"
      :loading="loadingForm"
      :submitButtonLabel="$t('button.update')"
      @submit="updateMonitoringLine"
      @quit="quit()"
    />
    <LoadingSpinner v-if="loading" />
  </div>
</template>

<script setup lang="ts">
import { useMonitoringStore } from "@/stores/monitoring";
import monitoringLineService from "@/services/MonitoringLineService";
import { onMounted, ref } from "vue";
import type { ApiError } from "@/models/ApiError";
import type { MonitoringLine } from "@/models/MonitoringLine";
import responseService from "@/services/ResponseService";
import monitoringLineScript from "@/scripts/MonitoringLineScript";
import MonitoringLineForm from "./MonitoringLineForm.vue";
import monitoringScript from "@/scripts/MonitoringScript";
import router from "@/router";
import LoadingSpinner from "@/components/common/LoadingSpinner.vue";

const monitoringStore = useMonitoringStore();

const apiErrors = ref([] as ApiError[]);
const loadingForm = ref(false);
const monitoringLine = ref(monitoringLineScript.init());
const loading = ref(true);

const props = defineProps({
  id: {
    default: 0,
  },
  monitoringToAddLine: {
    default: monitoringScript.init(),
  },
});

onMounted(async () => {
  monitoringLine.value = await monitoringLineService.getMonitoringLine(props.id);
  loading.value = false;
});

async function updateMonitoringLine(monitoringLine: MonitoringLine) {
  try {
    loadingForm.value = true;
    const isUpdated = await monitoringLineService.updateMonitoringLine(monitoringLine);
    if (!isUpdated) {
      apiErrors.value = [
        { message: "Impossible de modifier la ligne de suivi", code: "", level: "error" },
      ];
    } else {
      monitoringStore.updateMonitoringLine(monitoringLine);
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
