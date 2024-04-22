<template>
  <div>
    <PlotForm
      v-show="!loading"
      :apiErrors="apiErrors"
      :plotToUpdate="plot"
      :header="'Modification d\'une parcelle'"
      :submitButtonLabel="'Modifier'"
      :loading="loadingForm"
      @submit="updatePlot"
      @quit="quit()"
    />
    <LoadingSpinner v-if="loading" />
  </div>
</template>

<script setup lang="ts">
import type { ApiError } from "@/models/ApiError";
import type { Plot } from "@/models/Plot";
import router from "@/router";
import plotService from "@/services/PlotService";
import responseService from "@/services/ResponseService";
import { ref, onMounted } from "vue";
import LoadingSpinner from "@/components/common/LoadingSpinner.vue";
import plotScript from "@/scripts/PlotScript";
import PlotForm from "@/components/plot/PlotForm.vue";
import { usePlotStore } from "@/stores/plot";

const plotStore = usePlotStore();

const loadingForm = ref(false);
const apiErrors = ref([] as ApiError[]);
const plot = ref(plotScript.init());
const loading = ref(true);

const props = defineProps({
  id: {
    default: 0,
  },
});

onMounted(async () => {
  plot.value = await plotService.getPlot(props.id);
  loading.value = false;
});

async function updatePlot(plot: Plot) {
  try {
    loadingForm.value = true;
    const isUpdated = await plotService.updatePlot(plot);
    if (!isUpdated) {
      apiErrors.value = [
        { message: "Impossible de modifier la parcelle", code: "", level: "error" },
      ];
    } else {
      plotStore.updatePlot(plot);
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
