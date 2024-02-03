<template>
  <div>
    <div :class="getCardClass()" style="height: 100%" @click="selectMonitoring">
      <div class="grid p-2">
        <div class="col-6">
          {{ monitoring.name }} ({{
            getMonitoringTypeLabel(monitoring.type)
          }})
        </div>
        <div class="col-6">
          <Button
            icon="pi pi-file-edit"
            class="m-1"
            raised
            rounded
            @click.stop="openUpdateMonitoring()"
          />
          <Button
            icon="pi pi-plus-circle"
            class="m-1"
            raised
            rounded
            severity="info"
            @click.stop="addMonitoringLine()"
          />
          <Button
            icon="pi pi-trash"
            class="m-1"
            raised
            rounded
            severity="danger"
            @click.stop="deleteMonitoring()"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import monitoringScript from "@/scripts/MonitoringScript";
import Button from "primevue/button";
import { useMonitoringStore } from "@/stores/monitoring";
import { useI18n } from "vue-i18n";

const monitoringStore = useMonitoringStore();

const emit = defineEmits([
  "openUpdateMonitoring",
  "deleteMonitoring",
  "selectMonitoring",
  "addMonitoringLine",
]);
const props = defineProps({
  monitoring: {
    default: monitoringScript.init(),
  },
});
const cardClassBase = "selectable-card container p-1 cursor-pointer";
function getCardClass() {
  let cardClass = cardClassBase;
  if (!props.monitoring.enabled) {
    cardClass = cardClassBase + " unabled-card";
  }
  if (
    monitoringStore.selectedMonitorings.find(
      (monitoring) => monitoring.id === props.monitoring.id
    )
  ) {
    return cardClass + " selected-card";
  }
  return cardClass;
}
function getMonitoringTypeLabel(code: string) {
  const { t } = useI18n();
  const key = monitoringScript.getMonitoringTypeI18nKey(code);
  return t(key);
}
function openUpdateMonitoring() {
  emit("openUpdateMonitoring", props.monitoring);
}
function deleteMonitoring() {
  emit("deleteMonitoring", props.monitoring.id);
}
function selectMonitoring() {
  emit("selectMonitoring", props.monitoring);
}
function addMonitoringLine() {
  emit("addMonitoringLine", props.monitoring)
}
</script>
