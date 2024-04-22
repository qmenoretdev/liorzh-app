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
    selectedMonitorings.value.forEach((monitoring: Monitoring, i: number) => {
      if (monitoring.id === monitoringLine.monitoring.id) {
        monitoring.monitoringLines?.forEach((monitoringLineIn: MonitoringLine, y: number) => {
          if (monitoringLineIn.id === monitoringLine.id) {
            selectedMonitorings.value[i].monitoringLines[y] = monitoringLine
            return;
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
  function updateMonitoring(monitoring: Monitoring) {
    selectedMonitorings.value.forEach((monitoringIn: Monitoring, i: number) => {
      if (monitoring.id === monitoringIn.id) {
        selectedMonitorings.value[i] = monitoring;
        return;
      }
    });
    monitorings.value.forEach((monitoringIn: Monitoring, i: number) => {
      if (monitoring.id === monitoringIn.id) {
        monitorings.value[i] = monitoring;
        return;
      }
    });
  }
  return { monitorings, setMonitorings, selectedMonitorings, setSelectedMonitorings, removeMonitoringLine, updateMonitoringLine, updateMonitoring }
})
