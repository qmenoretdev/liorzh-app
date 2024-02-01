<template>
  <div>
    <Button
      rounded
      label="Nouvelle Ligne"
      icon="pi pi-plus-circle"
      @click="monitoringLineCreationVisible = true"
    />
    <template v-if="props.mode === MONITORING_LINE_DISPLAY_MODE.AGGREGATE">
      <MonitoringLineDataTable
        class="col-12 mt-2"
        :monitoringLines="aggregateMonitoringLines"
        :loading="loading"
        @delete="deleteMonitoringLine"
        @update="openUpdateMonitoringLine" />
    </template>
    <MonitoringLineForm
      :header="'Création d\'une ligne de suivi'"
      :visible="monitoringLineCreationVisible || monitoringToAddLine.id !== 0"
      :apiErrors="apiErrors"
      :loading="loadingForm"
      :monitoringToAddLine="monitoringToAddLine"
      @submit="createMonitoringLine"
      @close="closeModal()"
    />
    <MonitoringLineForm
      :header="'Modification d\'une ligne de suivi'"
      :monitoringLineToUpdate="selectedMonitoringLine"
      :visible="monitoringLineUpdateVisible"
      :apiErrors="apiErrors"
      :loading="loadingForm"
      :submitButtonLabel="'Modifier'"
      @submit="updateMonitoringLine"
      @close="closeModal()"
    />
  </div>
</template>

<script setup lang="ts">
import { useMonitoringStore } from "@/stores/monitoring";
import { MONITORING_LINE_DISPLAY_MODE } from "@/utils/constant"
import { computed } from "vue";
import MonitoringLineDataTable from "@/components/monitoringline/MonitoringLineDataTable.vue"
import monitoringLineService from "@/services/MonitoringLineService"
import Button from "primevue/button";
import { ref } from "vue";
import type { ApiError } from "@/models/ApiError";
import type { MonitoringLine } from "@/models/MonitoringLine";
import { defaultConfirmDialogOptions } from "@/scripts/CommonScript";
import { useConfirm } from "primevue/useconfirm";
import responseService from "@/services/ResponseService";
import monitoringLineScript from "@/scripts/MonitoringLineScript";
import MonitoringLineForm from "./MonitoringLineForm.vue";
import monitoringScript from "@/scripts/MonitoringScript";

const monitoringStore = useMonitoringStore();
const confirm = useConfirm();

const monitoringLineCreationVisible = ref(false);
const monitoringLineUpdateVisible = ref(false);
const apiErrors = ref([] as ApiError[]);
const loadingForm = ref(false);
const selectedMonitoringLine = ref(monitoringLineScript.init());

const emit = defineEmits([
  "resetMonitoringToAddLine",
]);

const aggregateMonitoringLines = computed(() => {
  if (props.mode !== MONITORING_LINE_DISPLAY_MODE.AGGREGATE) {
    return []
  }
  const aggregateMonitoringLines = []
  for (const monitoringLine of monitoringStore.selectedMonitorings) {
    aggregateMonitoringLines.push(...monitoringLine.monitoringLines);
  }
  return aggregateMonitoringLines;
});

const props = defineProps({
  mode: {
    default: MONITORING_LINE_DISPLAY_MODE.AGGREGATE,
  },
  monitoringToAddLine: {
    default: monitoringScript.init()
  },
  loading: {
    default: false,
  },
});

function closeModal() {
  monitoringLineCreationVisible.value = false;
  monitoringLineUpdateVisible.value = false;
  emit("resetMonitoringToAddLine");
}
async function createMonitoringLine(monitoringLine: MonitoringLine) {
  try {
    loadingForm.value = true;
    const createdMonitoringLine = await monitoringLineService.createMonitoringLine(monitoringLine);
    if (createdMonitoringLine) {
      closeModal();
      monitoringStore.monitorings.forEach(monitoring => {
        if (monitoring.id === createdMonitoringLine.monitoring.id) {
          monitoring.monitoringLines?.push(createdMonitoringLine);
        }
      })
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
async function updateMonitoringLine(monitoringLine: MonitoringLine) {
  try {
    loadingForm.value = true;
    const isUpdated = await monitoringLineService.updateMonitoringLine(monitoringLine);
    if (!isUpdated) {
      apiErrors.value = [
        { message: "Impossible de modifier le suivi", code: "", level: "error" },
      ];
    } else {
      monitoringLineUpdateVisible.value = false;
    }
  } catch (error: any) {
    apiErrors.value = responseService.getApiErrors(error);
  }
  loadingForm.value = false;
}
async function deleteMonitoringLine(id: number) {
  let confirmDialog = defaultConfirmDialogOptions;
  confirmDialog.message = "Etes-vous certain de vouloir supprimer cette ligne ?";
  confirmDialog.accept = async () => {
    try {
      const isDeleted = await monitoringLineService.deleteMonitoringLine(id);
      if (!isDeleted) {
        apiErrors.value = [
          {
            message: "Impossible de supprimer cette ligne",
            code: "",
            level: "error",
          },
        ];
      } else {
        monitoringStore.selectedMonitorings.forEach(monitoring => {
          monitoring.monitoringLines = monitoring.monitoringLines?.filter(monitoringLine => {
            monitoringLine.id !== id
          })
        });
      }
    } catch (error: any) {
      apiErrors.value = responseService.getApiErrors(error);
    }
  };
  confirm.require(confirmDialog);
}
function openUpdateMonitoringLine(monitoringLine: MonitoringLine) {
  selectedMonitoringLine.value = monitoringLine;
  monitoringLineUpdateVisible.value = true;
}
</script>