<template>
  <div>
    <MonitoringLineForm
      v-show="!loading"
      :header="$t('monitoringLine.createTitle')"
      :apiErrors="apiErrors"
      :loading="loadingForm"
      :monitoringToAddLine="monitoringToAddLine"
      :submitButtonLabel="$t('button.create')"
      @submit="createMonitoringLine"
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
import MonitoringLineForm from "@/components/monitoringline/MonitoringLineForm.vue";
import router from "@/router";
import { useRoute } from "vue-router";
import LoadingSpinner from "@/components/common/LoadingSpinner.vue";
import monitoringLineScript from "@/scripts/MonitoringLineScript";
import { queryParams } from "@/utils/queryParams";
import monitoringService from "@/services/MonitoringService";

const route = useRoute();

const monitoringStore = useMonitoringStore();
const monitoringToAddLine = ref(monitoringLineScript.init());

const apiErrors = ref([] as ApiError[]);
const loadingForm = ref(false);
const loading = ref(true);

onMounted(async () => {
  const query = route.query;
  if (
    Object.keys(query).length > 0 &&
    Object.keys(query).includes(queryParams.monitoring.id)
  ) {
    monitoringToAddLine.value = await monitoringService.getMonitoring(query.monitoringId);
  }
  loading.value = false;
});

async function createMonitoringLine(monitoringLine: MonitoringLine) {
  try {
    loadingForm.value = true;
    const createdMonitoringLine = await monitoringLineService.createMonitoringLine(
      monitoringLine
    );
    if (createdMonitoringLine) {
      monitoringStore.monitorings.forEach((monitoring) => {
        if (monitoring.id === createdMonitoringLine.monitoring.id) {
          monitoring.monitoringLines?.push(createdMonitoringLine);
        }
      });
      quit();
    } else {
      apiErrors.value = [
        { message: "Impossible de créer la ligne de suivi", code: "", level: "error" },
      ];
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
