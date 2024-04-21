<template>
  <div v-if="!loading">
    <div class="grid col-12" v-if="plotStore.plots.length === 0">
      <span>
        <InlineMessage class="col-12 mb-1" severity="info"
          >Vous n'avez pas encore de Parcelle. Commencer par en ajouter
          une.</InlineMessage
        >
        <div
          class="pi pi-question-circle"
          v-tooltip="'Les suivis de culture doivent être associés à une Parcelle.'"
        ></div
      ></span>
    </div>
    <div class="col-12">
      <Button
        rounded
        label="Nouvelle parcelle"
        icon="pi pi-plus-circle"
        @click="goToCreatePlot"
      />
      <div class="grid col-12 mt-1" v-if="plotStore.plots.length > 0">
        <template v-for="plot in plotStore.plots" :key="plot.id">
          <PlotCard
            :plot="plot"
            class="col-12 md:col-6 lg:col-4"
            @openUpdatePlot="goToUpdatePlot"
            @deletePlot="deletePlot"
            @selectPlot="selectPlot"
          />
        </template>
      </div>
    </div>
  </div>
  <LoadingSpinner v-else />
</template>

<script setup lang="ts">
import Button from "primevue/button";
import { usePlotStore } from "@/stores/plot";
import { ref } from "vue";
import type { Plot } from "@/models/Plot";
import plotService from "@/services/PlotService";
import type { ApiError } from "@/models/ApiError";
import responseService from "@/services/ResponseService";
import { onMounted } from "vue";
import LoadingSpinner from "@/components/common/LoadingSpinner.vue";
import PlotCard from "@/components/plot/PlotCard.vue";
import { useConfirm } from "primevue/useconfirm";
import { defaultConfirmDialogOptions } from "@/scripts/CommonScript";
import InlineMessage from "primevue/inlinemessage";
import projectService from "@/services/ProjectService";
import { useUserStore } from "@/stores/user";
import links from "@/utils/links";
import router from "@/router";

const emit = defineEmits(["selectPlot"]);

const confirm = useConfirm();
const userStore = useUserStore();
const plotStore = usePlotStore();

const loading = ref(false);

const apiErrors = ref([] as ApiError[]);

onMounted(async () => {
  getPlots();
});

function goToCreatePlot() {
  router.push(links.plotCreate());
}

function goToUpdatePlot(plot: Plot) {
  router.push(links.plotUpdate(plot));
}

async function deletePlot(id: number) {
  let confirmDialog = defaultConfirmDialogOptions;
  confirmDialog.message = "Etes-vous certain de vouloir supprimer cette parcelle ?";
  confirmDialog.accept = async () => {
    try {
      const isDeleted = await plotService.deletePlot(id);
      if (!isDeleted) {
        apiErrors.value = [
          {
            message: "Impossible de supprimer la parcelle",
            code: "",
            level: "error",
          },
        ];
      } else {
        plotStore.setPlots(plotStore.plots.filter((plot: Plot) => plot.id !== id));
      }
    } catch (error: any) {
      apiErrors.value = responseService.getApiErrors(error);
    }
  };
  confirm.require(confirmDialog);
}

async function getPlots() {
  loading.value = true;
  const plots = await projectService.getPlotsByProject(
    userStore.activeProjectUser.project
  );
  plotStore.setPlots(plots);
  loading.value = false;
}

function selectPlot(plot: Plot) {
  emit("selectPlot", plot);
}
</script>
