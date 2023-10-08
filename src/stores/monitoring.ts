import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Monitoring } from '@/models/Monitoring';

export const useMonitoringStore = defineStore('monitoringStore', () => {
  const monitorings = ref([] as Monitoring[]);
  const selectedMonitorings = ref([] as Monitoring[]);
  function setMonitorings(monitoringsValue: Monitoring[]) {
    monitorings.value = monitoringsValue;
  }
  function setSelectedMonitorings(monitoringsValue: Monitoring[]) {
    selectedMonitorings.value = monitoringsValue;
  }
  return { monitorings, setMonitorings, selectedMonitorings, setSelectedMonitorings }
})
