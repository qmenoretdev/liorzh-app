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
          class="mr-4"
          label="Nouveau suivi"
          icon="pi pi-plus-circle"
          @click="goToCreateMonitoring"
        />
        <div class="flex align-items-center">
          <label for="enabledOnlyFilter" class="mr-2">Actif uniquement</label>
          <Checkbox
            v-model="workspaceStore.workspace.monitoringPanel.filters.enabledOnly"
            :binary="true"
            id="enabledOnlyFilter"
          >
          </Checkbox>
        </div>
      </div>
      <div v-if="!loading">
        <div class="grid col-12 mt-1" v-if="filteredMonitorings.length > 0">
          <template v-for="monitoring in filteredMonitorings" :key="monitoring.id">
            <MonitoringCard
              :monitoring="monitoring"
              class="col-12 md:col-8 lg:col-4"
              @goToUpdateMonitoring="goToUpdateMonitoring"
              @deleteMonitoring="deleteMonitoring"
              @selectMonitoring="selectMonitoring"
              @addMonitoringLine="addMonitoringLine"
            />
          </template>
          <MonitoringLinePanel
            class="col-12"
            :monitoringToAddLine="monitoringToAddLine"
          />
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
import type { Monitoring } from "@/models/Monitoring";
import MonitoringCard from "@/components/monitoring/MonitoringCard.vue";
import { defaultConfirmDialogOptions } from "@/scripts/CommonScript";
import { useConfirm } from "primevue/useconfirm";
import monitoringScript from "@/scripts/MonitoringScript";
import { useWorkspaceStore } from "@/stores/workspace";
import Checkbox from "primevue/checkbox";
import MonitoringLinePanel from "@/components/monitoringline/MonitoringLinePanel.vue";
import monitoringLineService from "@/services/MonitoringLineService";
import router from "@/router";
import links from "@/utils/links";

const monitoringStore = useMonitoringStore();
const plotStore = usePlotStore();
const workspaceStore = useWorkspaceStore();
const plotPanelVisible = ref(true);
const apiErrors = ref([] as ApiError[]);
const apiGetErrors = ref([] as ApiError[]);
const loading = ref(false);
const confirm = useConfirm();
const monitoringToAddLine = ref(monitoringScript.init());

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
async function selectMonitoring(monitoring: Monitoring) {
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
    monitoring.monitoringLines = [];
    monitoringStore.selectedMonitorings.push(monitoring);
    monitoring.monitoringLines = await monitoringLineService.getMonitoringLinesByMonitoring(
      monitoring.id
    );
  }
}
function goToUpdateMonitoring(monitoring: Monitoring) {
  router.push({ name: "MonitoringUpdate", params: { id: monitoring.id } });
}
function goToCreateMonitoring() {
  router.push({ name: "MonitoringCreate" });
}
function addMonitoringLine(monitoring: Monitoring) {
  router.push(links.addMonitoringLine(monitoring));
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
</script>
