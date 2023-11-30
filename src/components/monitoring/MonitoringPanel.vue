<template>
  <div>
    <PlotPanel @selectPlot="selectPlot" v-if="plotPanelVisible" />
    <div v-else>
      <div class="grid">
        <Button
          text
          raised
          rounded
          icon="pi pi-chevron-left"
          @click="plotPanelVisible = true"
          severity="secondary"
          class="mr-2"
        />
        <Button
          rounded
          class="button-create mr-4"
          label="Nouveau suivi"
          icon="pi pi-plus-circle"
          @click="monitoringCreationVisible = true"
        />
        <div class="mr-2 pi pi-filter"></div>
        <div
          :class="
            getFilterClass(workspaceStore.workspace.monitoringPanel.filters.enabledOnly)
          "
          @click="
            workspaceStore.workspace.monitoringPanel.filters.enabledOnly = !workspaceStore
              .workspace.monitoringPanel.filters.enabledOnly
          "
        >
          Actif uniquement
        </div>
      </div>
      <div v-if="!loading">
        <div class="grid col-12 mt-1" v-if="filteredMonitorings.length > 0">
          <template v-for="monitoring in filteredMonitorings" :key="monitoring.id">
            <MonitoringCard
              :monitoring="monitoring"
              class="col-12 md:col-6 lg:col-3"
              @openUpdateMonitoring="openUpdateMonitoring"
              @deleteMonitoring="deleteMonitoring"
              @selectMonitoring="selectMonitoring"
            />
          </template>
        </div>
      </div>
      <LoadingSpinner v-else />
      <InlineMessage
        class="col-12 mb-1"
        v-for="apiError in apiGetErrors"
        :key="apiError"
        :severity="apiError.level"
        >{{ apiError.message }}</InlineMessage
      >
      <MonitoringForm
        :header="'Création d\'un suivi'"
        :visible="monitoringCreationVisible"
        :apiErrors="apiErrors"
        :loading="loadingForm"
        @submit="createMonitoring"
        @close="closeModal()"
      />
      <MonitoringForm
        :header="'Modification d\'un suivi'"
        :monitoringToUpdate="selectedMonitoring"
        :visible="monitoringUpdateVisible"
        :apiErrors="apiErrors"
        :loading="loadingForm"
        :submitButtonLabel="'Modifier'"
        @submit="updateMonitoring"
        @close="closeModal()"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import PlotPanel from "@/components/plot/PlotPanel.vue";
import { ref, computed, onMounted } from "vue";
import type { Plot } from "@/models/Plot";
import Button from "primevue/button";
import { useMonitoringStore } from "@/stores/monitoring";
import { usePlotStore } from "@/stores/plot";
import monitoringService from "@/services/MonitoringService";
import type { ApiError } from "@/models/ApiError";
import responseService from "@/services/ResponseService";
import InlineMessage from "primevue/inlinemessage";
import LoadingSpinner from "@/components/common/LoadingSpinner.vue";
import MonitoringForm from "@/components/monitoring/MonitoringForm.vue";
import type { Monitoring } from "@/models/Monitoring";
import MonitoringCard from "@/components/monitoring/MonitoringCard.vue";
import { defaultConfirmDialogOptions } from "@/scripts/CommonScript";
import { useConfirm } from "primevue/useconfirm";
import monitoringScript from "@/scripts/MonitoringScript";
import { useWorkspaceStore } from "@/stores/workspace";

const monitoringStore = useMonitoringStore();
const plotStore = usePlotStore();
const workspaceStore = useWorkspaceStore();
const plotPanelVisible = ref(true);
const apiErrors = ref([] as ApiError[]);
const apiGetErrors = ref([] as ApiError[]);
const loading = ref(false);
const loadingForm = ref(false);
const monitoringCreationVisible = ref(false);
const monitoringUpdateVisible = ref(false);
const confirm = useConfirm();
const selectedMonitoring = ref(monitoringScript.init());

const filteredMonitorings = computed(() =>
  filterMonitorings(monitoringStore.monitorings)
);

onMounted(() => {
  if (plotStore.selectedPlot.id !== 0) {
    getMonitoringsByPlot(plotStore.selectedPlot);
  }
});

function selectPlot(plot: Plot) {
  plotStore.selectedPlot = plot;
  getMonitoringsByPlot(plot);
}
async function getMonitoringsByPlot(plot: Plot) {
  plotPanelVisible.value = false;
  loading.value = true;
  try {
    const monitorings = await monitoringService.getMonitoringsByPlot(plot.id);
    monitoringStore.setMonitorings(monitorings);
  } catch (error: any) {
    apiGetErrors.value = responseService.getApiErrors(error);
  }
  loading.value = false;
}
function closeModal() {
  monitoringCreationVisible.value = false;
  monitoringUpdateVisible.value = false;
}
async function createMonitoring(monitoring: Monitoring) {
  try {
    loadingForm.value = true;
    monitoring.plot = plotStore.selectedPlot;
    const createdMonitoring = await monitoringService.createMonitoring(monitoring);
    if (createdMonitoring) {
      closeModal();
      monitoringStore.monitorings.push(createdMonitoring);
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
async function updateMonitoring(monitoring: Monitoring) {
  try {
    loadingForm.value = true;
    const isUpdated = await monitoringService.updateMonitoring(monitoring);
    if (!isUpdated) {
      apiErrors.value = [
        { message: "Impossible de modifier le suivi", code: "", level: "error" },
      ];
    } else {
      monitoringUpdateVisible.value = false;
    }
  } catch (error: any) {
    apiErrors.value = responseService.getApiErrors(error);
  }
  loadingForm.value = false;
}
async function deleteMonitoring(id: number) {
  let confirmDialog = defaultConfirmDialogOptions;
  confirmDialog.message = "Etes-vous certain de vouloir supprimer ce suivi ?";
  confirmDialog.accept = async () => {
    try {
      const isDeleted = await monitoringService.deleteMonitoring(id);
      if (!isDeleted) {
        apiErrors.value = [
          {
            message: "Impossible de supprimer le suivi",
            code: "",
            level: "error",
          },
        ];
      } else {
        monitoringStore.setMonitorings(
          monitoringStore.monitorings.filter(
            (monitoring: Monitoring) => monitoring.id !== id
          )
        );
      }
    } catch (error: any) {
      apiErrors.value = responseService.getApiErrors(error);
    }
  };
  confirm.require(confirmDialog);
}
function selectMonitoring(monitoring: Monitoring) {
  if (
    monitoringStore.selectedMonitorings.find(
      (monitoringInStore: Monitoring) => monitoringInStore.id === monitoring.id
    )
  ) {
    monitoringStore.setSelectedMonitorings(
      monitoringStore.selectedMonitorings.filter(
        (monitoringInStore: Monitoring) => monitoringInStore.id !== monitoring.id
      )
    );
  } else {
    monitoringStore.selectedMonitorings.push(monitoring);
  }
}
function openUpdateMonitoring(monitoring: Monitoring) {
  selectedMonitoring.value = monitoring;
  monitoringUpdateVisible.value = true;
}
function filterMonitorings(monitorings: Monitoring[]) {
  let filteredMonitorings = [] as Monitoring[];
  filteredMonitorings.push(...monitorings);
  if (workspaceStore.workspace.monitoringPanel.filters.enabledOnly) {
    filteredMonitorings = filteredMonitorings.filter(
      (monitoring: Monitoring) => monitoring.enabled
    );
  }
  monitoringStore.setSelectedMonitorings(
    monitoringStore.selectedMonitorings.filter((monitoring: Monitoring) =>
      filteredMonitorings.includes(monitoring)
    )
  );
  return filteredMonitorings;
}
function getFilterClass(isSelectedFilter: boolean) {
  let filterClass = "col-2 selectable-filter";
  if (isSelectedFilter) {
    filterClass += " selected-filter";
  }
  return filterClass;
}
</script>
