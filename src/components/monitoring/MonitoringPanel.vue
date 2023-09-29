<template>
  <div>
    <PlotPanel @selectPlot="selectPlot" v-if="plotPanelVisible" />
    <div v-else>
      <Button
        text
        raised
        rounded
        icon="pi pi-chevron-left"
        @click="plotPanelVisible = true"
        severity="secondary"
      />
      {{ selectedPlot }}
    </div>
  </div>
</template>

<script setup lang="ts">
import PlotPanel from "@/components/plot/PlotPanel.vue";
import { ref } from "vue";
import plotScript from "@/scripts/PlotScript";
import type { Plot } from "@/models/Plot";
import Button from "primevue/button";

const selectedPlot = ref(plotScript.init());

const plotPanelVisible = ref(true);

function selectPlot(plot: Plot) {
  selectedPlot.value = plot;
  plotPanelVisible.value = false;
}
</script>
