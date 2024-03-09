import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Monitoring } from '@/models/Monitoring';
import type { MonitoringLine } from '@/models/MonitoringLine';

export const useMonitoringStore = defineStore('monitoringStore', () => {
  const monitorings = ref([] as Monitoring[]);
  const selectedMonitorings = ref([] as Monitoring[]);
  function setMonitorings(monitoringsValue: Monitoring[]) {
    monitorings.value = monitoringsValue;
  }
  function setSelectedMonitorings(monitoringsValue: Monitoring[]) {
    selectedMonitorings.value = monitoringsValue;
  }
  function removeMonitoringLine(monitoringLine: MonitoringLine) {
    selectedMonitorings.value.forEach(monitoring => {
      if (monitoring.id === monitoringLine.monitoring.id) {
        monitoring.monitoringLines = monitoring.monitoringLines?.filter(
          monitoringLineIn => monitoringLineIn.id !== monitoringLine.id);
      }
    });
    monitorings.value.forEach(monitoring => {
      if (monitoring.id === monitoringLine.monitoring.id) {
        monitoring.monitoringLines = monitoring.monitoringLines?.filter(
          monitoringLineIn => monitoringLineIn.id !== monitoringLine.id);
      }
    })
  }
  function updateMonitoringLine(monitoringLine: MonitoringLine) {
    selectedMonitorings.value.forEach(monitoring => {
      if (monitoring.id === monitoringLine.monitoring.id) {
        monitoring.monitoringLines?.forEach(monitoringLineIn => {
          if (monitoringLineIn.id === monitoringLine.id) {
            monitoringLineIn = monitoringLine
          }
        });
      }
    });
    monitorings.value.forEach(monitoring => {
      if (monitoring.id === monitoringLine.monitoring.id) {
        monitoring.monitoringLines?.forEach(monitoringLineIn => {
          if (monitoringLineIn.id === monitoringLine.id) {
            monitoringLineIn = monitoringLine
          }
        });
      }
    });
  }
  return { monitorings, setMonitorings, selectedMonitorings, setSelectedMonitorings, removeMonitoringLine, updateMonitoringLine }
})
