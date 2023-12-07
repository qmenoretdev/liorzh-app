<template>
  <div>
    <h3 class="mt-1 mb-2">
      <i>{{ variety.specy.botanicalName }}</i> {{ variety.name }}
    </h3>
    <fieldset class="fieldset-with-legend">
      <legend class="fieldset-legend">Espèce</legend>
      <SpecyDetails :specy="variety.specy" />
    </fieldset>
    <fieldset class="fieldset-with-legend">
      <legend class="fieldset-legend">Variété</legend>
      <ul class="no-puce p-1 m-1">
        <li>
          <span><b>Nom : </b>{{ variety.name }}</span>
        </li>
        <li>
          <span><b>Description : </b>{{ variety.description }}</span>
        </li>
        <li>
          <span><b>Visibilité : </b>{{ variety.visibility }}</span>
        </li>
      </ul>
    </fieldset>
  </div>
</template>

<script setup lang="ts">
import varietyScript from "@/scripts/VarietyScript";
import SpecyDetails from "@/components/specy/SpecyDetails.vue";

defineProps({
  variety: {
    default: varietyScript.init(),
  },
});
</script>
