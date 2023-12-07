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
        @click="plotCreationVisible = true"
      />
      <div class="grid col-12 mt-1" v-if="plotStore.plots.length > 0">
        <template v-for="plot in plotStore.plots" :key="plot.id">
          <PlotCard
            :plot="plot"
            class="col-12 md:col-6 lg:col-4"
            @openUpdatePlot="openUpdatePlot"
            @deletePlot="deletePlot"
            @selectPlot="selectPlot"
          />
        </template>
      </div>
    </div>
    <PlotForm
      :visible="plotCreationVisible"
      :apiErrors="apiErrors"
      :loading="loadingForm"
      @submit="createPlot"
      @close="closeModal()"
    />
    <PlotForm
      :visible="plotUpdateVisible"
      :apiErrors="apiErrors"
      :plotToUpdate="selectedPlot"
      :header="'Modification d\'une parcelle'"
      :submitButtonLabel="'Modifier'"
      :loading="loadingForm"
      @submit="updatePlot"
      @close="closeModal()"
    />
  </div>
  <LoadingSpinner v-else />
</template>

<script setup lang="ts">
import Button from "primevue/button";
import PlotForm from "@/components/plot/PlotForm.vue";
import { usePlotStore } from "@/stores/plot";
import { ref } from "vue";
import type { Plot } from "@/models/Plot";
import plotService from "@/services/PlotService";
import type { ApiError } from "@/models/ApiError";
import responseService from "@/services/ResponseService";
import { onMounted } from "vue";
import LoadingSpinner from "@/components/common/LoadingSpinner.vue";
import plotScript from "@/scripts/PlotScript";
import PlotCard from "@/components/plot/PlotCard.vue";
import { useConfirm } from "primevue/useconfirm";
import { defaultConfirmDialogOptions } from "@/scripts/CommonScript";
import InlineMessage from "primevue/inlinemessage";

const emit = defineEmits(["selectPlot"]);

const confirm = useConfirm();
const plotStore = usePlotStore();
const plotCreationVisible = ref(false);
const plotUpdateVisible = ref(false);

const loading = ref(false);
const loadingForm = ref(false);

const apiErrors = ref([] as ApiError[]);

const selectedPlot = ref(plotScript.init());

onMounted(async () => {
  getPlots();
});

async function createPlot(plot: Plot) {
  try {
    loadingForm.value = true;
    const createdPlot = await plotService.createPlot(plot);
    if (createdPlot) {
      plotCreationVisible.value = false;
      getPlots();
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

function openUpdatePlot(plot: Plot) {
  plotUpdateVisible.value = true;
  selectedPlot.value = plot;
}

async function updatePlot(plot: Plot) {
  try {
    loadingForm.value = true;
    const isUpdated = await plotService.updatePlot(plot);
    if (!isUpdated) {
      apiErrors.value = [
        { message: "Impossible de modifier la parcelle", code: "", level: "error" },
      ];
    } else {
      plotUpdateVisible.value = false;
    }
  } catch (error: any) {
    apiErrors.value = responseService.getApiErrors(error);
  }
  loadingForm.value = false;
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
  const plots = await plotService.getPlots();
  plotStore.setPlots(plots);
  loading.value = false;
}

function closeModal() {
  plotCreationVisible.value = false;
  plotUpdateVisible.value = false;
  selectedPlot.value = plotScript.init();
  getPlots();
}

function selectPlot(plot: Plot) {
  emit("selectPlot", plot);
}
</script>
