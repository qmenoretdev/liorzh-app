<template>
  <div>
    <PlotForm
      :apiErrors="apiErrors"
      :loading="loadingForm"
      @submit="createPlot"
      @quit="quit()"
    />
  </div>
</template>

<script setup lang="ts">
import type { ApiError } from "@/models/ApiError";
import type { Plot } from "@/models/Plot";
import router from "@/router";
import plotService from "@/services/PlotService";
import responseService from "@/services/ResponseService";
import { ref } from "vue";
import PlotForm from "@/components/plot/PlotForm.vue";
import { usePlotStore } from "@/stores/plot";

const plotStore = usePlotStore();
const loadingForm = ref(false);
const apiErrors = ref([] as ApiError[]);

async function createPlot(plot: Plot) {
  try {
    loadingForm.value = true;
    const createdPlot = await plotService.createPlot(plot);
    if (createdPlot) {
      plotStore.plots.push(createdPlot);
      quit();
    } else {
      apiErrors.value = [
        { message: "Impossible de créer la parcelle", code: "", level: "error" },
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
