<template>
  <div>
    <div
      class="clickable-card container p-1 cursor-pointer"
      style="height: 100%"
      @click="selectPlot"
    >
      <div class="col-12">
        <Button
          icon="pi pi-file-edit"
          class="mr-2 z-2"
          text
          raised
          rounded
          @click.stop="openUpdatePlot()"
        />
        <Button
          icon="pi pi-trash"
          text
          raised
          rounded
          severity="danger"
          @click.stop="deletePlot()"
        />
      </div>
      <div>
        <div style="text-align: center">
          <h2>
            {{ plot.name }}
          </h2>
        </div>
        <ul class="no-puce p-2 m-2">
          <li v-show="plot.country">
            <img src="@/assets/img/country_32px.png" class="ul-icon" />
            <span style=""><b>Pays : </b>{{ plot.country }}</span>
          </li>
          <li v-show="plot.region">
            <img src="@/assets/img/region_32px.png" class="ul-icon" />
            <span style=""><b>Région : </b>{{ plot.region }}</span>
          </li>
          <li v-show="plot.subRegion">
            <img src="@/assets/img/subRegion_32px.png" class="ul-icon" />
            <span style=""><b>Département : </b>{{ plot.subRegion }}</span>
          </li>
          <li v-show="plot.city">
            <img src="@/assets/img/city_32px.png" class="ul-icon" />
            <span style=""><b>Ville : </b>{{ plot.city }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import plotScript from "@/scripts/PlotScript";
import Button from "primevue/button";

const emit = defineEmits(["openUpdatePlot", "deletePlot", "selectPlot"]);
const props = defineProps({
  plot: {
    default: plotScript.init(),
  },
});
function openUpdatePlot() {
  emit("openUpdatePlot", props.plot);
}
function deletePlot() {
  emit("deletePlot", props.plot.id);
}
function selectPlot() {
  emit("selectPlot", props.plot);
}
</script>
