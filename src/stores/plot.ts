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
  function updatePlot(plot: Plot) {
    plots.value.forEach((plotIn: Plot, i: number) => {
      if (plotIn.id === plot.id) {
        plots.value[i] = plot
        return;
      }
    });
  }
  return { plots, setPlots, selectedPlot, setSelectedPlot, updatePlot }
})
