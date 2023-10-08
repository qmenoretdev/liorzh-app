import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Plot } from '@/models/Plot';
import plotScript from '@/scripts/PlotScript';

export const usePlotStore = defineStore('plotStore', () => {
  const plots = ref([] as Plot[]);
  const selectedPlot = ref(plotScript.init());
  function setPlots(plotsValue: Plot[]) {
    plots.value = plotsValue;
  }
  function setSelectedPlot(plotsValue: Plot) {
    selectedPlot.value = plotsValue;
  }
  return { plots, setPlots, selectedPlot, setSelectedPlot }
})
