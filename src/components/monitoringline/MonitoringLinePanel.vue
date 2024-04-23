<template>
  <div>
    <Button
      rounded
      label="Nouvelle Ligne"
      icon="pi pi-plus-circle"
      @click="goToAddMonitoringLine"
    />
    <template v-if="props.mode === MONITORING_LINE_DISPLAY_MODE.AGGREGATE">
      <MonitoringLineDataTable
        class="col-12 mt-2"
        :monitoringLines="aggregateMonitoringLines"
        :loading="loading"
        @delete="deleteMonitoringLine"
        @update="goToUpdateMonitoringLine"
        @harvest="openHarvestMonitoringLine"
      />
    </template>
    <HarvestForm
      :visible="monitoringLineHarvestVisible"
      :header="$t('monitoringLine.harvest.updateTitle')"
      :monitoringLineToUpdate="selectedMonitoringLine"
      :apiErrors="apiErrors"
      :loading="loadingForm"
      :submitButtonLabel="$t('button.register')"
      @submit="updateMonitoringLine"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { useMonitoringStore } from "@/stores/monitoring";
import { MONITORING_LINE_DISPLAY_MODE } from "@/utils/constant";
import { computed } from "vue";
import MonitoringLineDataTable from "@/components/monitoringline/MonitoringLineDataTable.vue";
import monitoringLineService from "@/services/MonitoringLineService";
import Button from "primevue/button";
import { ref } from "vue";
import type { ApiError } from "@/models/ApiError";
import type { MonitoringLine } from "@/models/MonitoringLine";
import { defaultConfirmDialogOptions } from "@/scripts/CommonScript";
import { useConfirm } from "primevue/useconfirm";
import responseService from "@/services/ResponseService";
import monitoringLineScript from "@/scripts/MonitoringLineScript";
import HarvestForm from "@/components/monitoringline/HarvestForm.vue";
import router from "@/router";
import type { Monitoring } from "@/models/Monitoring";

const monitoringStore = useMonitoringStore();
const confirm = useConfirm();

const monitoringLineHarvestVisible = ref(false);
const apiErrors = ref([] as ApiError[]);
const loadingForm = ref(false);
const selectedMonitoringLine = ref(monitoringLineScript.init());

const aggregateMonitoringLines = computed(() => {
  if (props.mode !== MONITORING_LINE_DISPLAY_MODE.AGGREGATE) {
    return [];
  }
  const aggregateMonitoringLines = [];
  for (const monitoringLine of monitoringStore.selectedMonitorings) {
    aggregateMonitoringLines.push(...monitoringLine.monitoringLines);
  }
  return aggregateMonitoringLines;
});

const props = defineProps({
  mode: {
    default: MONITORING_LINE_DISPLAY_MODE.AGGREGATE,
  },
  loading: {
    default: false,
  },
});

const emits = defineEmits(["refreshLines"]);

function closeModal(monitoring: Monitoring) {
  monitoringLineHarvestVisible.value = false;
  emits("refreshLines", monitoring);
}
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
    }
  } catch (error: any) {
    apiErrors.value = responseService.getApiErrors(error);
  }
  loadingForm.value = false;
  closeModal(monitoringLine.monitoring);
}
async function deleteMonitoringLine(monitoringLine: MonitoringLine) {
  let confirmDialog = defaultConfirmDialogOptions;
  confirmDialog.message = "Etes-vous certain de vouloir supprimer cette ligne ?";
  confirmDialog.accept = async () => {
    try {
      const isDeleted = await monitoringLineService.deleteMonitoringLine(
        monitoringLine.id
      );
      if (!isDeleted) {
        apiErrors.value = [
          {
            message: "Impossible de supprimer cette ligne",
            code: "",
            level: "error",
          },
        ];
      } else {
        monitoringStore.removeMonitoringLine(monitoringLine);
      }
    } catch (error: any) {
      apiErrors.value = responseService.getApiErrors(error);
    }
  };
  confirm.require(confirmDialog);
}
function goToUpdateMonitoringLine(monitoringLine: MonitoringLine) {
  router.push({ name: "MonitoringLineUpdate", params: { id: monitoringLine.id } });
}
function goToAddMonitoringLine() {
  router.push({ name: "MonitoringLineCreate" });
}
function openHarvestMonitoringLine(monitoringLine: MonitoringLine) {
  selectedMonitoringLine.value = monitoringLine;
  monitoringLineHarvestVisible.value = true;
}
</script>
