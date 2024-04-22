<template>
  <MonitoringForm
    :header="'Création d\'un suivi'"
    :apiErrors="apiErrors"
    :loading="loadingForm"
    :submitButtonLabel="$t('button.create')"
    @submit="createMonitoring"
    @quit="quit()"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import monitoringService from "@/services/MonitoringService";
import type { ApiError } from "@/models/ApiError";
import responseService from "@/services/ResponseService";
import MonitoringForm from "@/components/monitoring/MonitoringForm.vue";
import type { Monitoring } from "@/models/Monitoring";
import router from "@/router";
import { useMonitoringStore } from "@/stores/monitoring";
import { usePlotStore } from "@/stores/plot";

const monitoringStore = useMonitoringStore();
const plotStore = usePlotStore();

const apiErrors = ref([] as ApiError[]);
const loadingForm = ref(false);

async function createMonitoring(monitoring: Monitoring) {
  try {
    loadingForm.value = true;
    monitoring.plot = plotStore.selectedPlot;
    const createdMonitoring = await monitoringService.createMonitoring(monitoring);
    if (createdMonitoring) {
      monitoringStore.monitorings.push(createdMonitoring);
      quit();
    } else {
      apiErrors.value = [
        { message: "Impossible de créer le suivi", code: "", level: "error" },
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
