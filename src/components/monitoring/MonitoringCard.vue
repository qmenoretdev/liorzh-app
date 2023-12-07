<template>
  <div>
    <div :class="getCardClass()" style="height: 100%" @click="selectMonitoring">
      <div class="grid p-2">
        <div class="col-8">
          {{ monitoring.name }} ({{
            monitoringScript.getMonitoringTypeLabel(monitoring.type)
          }})
        </div>
        <div class="col-4">
          <Button
            icon="pi pi-file-edit"
            class="mb-1"
            raised
            rounded
            @click.stop="openUpdateMonitoring()"
          />
          <Button
            icon="pi pi-trash"
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

const monitoringStore = useMonitoringStore();

const emit = defineEmits([
  "openUpdateMonitoring",
  "deleteMonitoring",
  "selectMonitoring",
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
function openUpdateMonitoring() {
  emit("openUpdateMonitoring", props.monitoring);
}
function deleteMonitoring() {
  emit("deleteMonitoring", props.monitoring.id);
}
function selectMonitoring() {
  emit("selectMonitoring", props.monitoring);
}
</script>
