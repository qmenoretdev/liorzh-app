import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Plot } from '@/models/Plot';

export const usePlotStore = defineStore('plotStore', () => {
  const plots = ref([] as Plot[]);
  const selectedPlots = ref([] as Plot[]);
  function setPlots(plotsValue: Plot[]) {
    plots.value = plotsValue;
  }
  function setSelectedPlots(plotsValue: Plot[]) {
    selectedPlots.value = plotsValue;
  }
  return { plots, setPlots, selectedPlots, setSelectedPlots }
})
