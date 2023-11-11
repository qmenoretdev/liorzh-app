<template>
  <div>
    <ul class="no-puce p-1 m-1">
      <li>
        <span
          ><b>Nom botanique : </b><i>{{ specy.botanicalName }}</i></span
        >
      </li>
      <li>
        <span
          ><b>Nom(s) Commun(s) : </b
          >{{ specyService.commonNamesArrayToString(specy.frenchCommonNames) }}</span
        >
      </li>
      <li>
        <span><b>Code UPOV : </b>{{ specy.upovCode }}</span>
      </li>
      <li>
        <span><b>Visibilité : </b>{{ specy.visibility }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import specyScript from "@/scripts/SpecyScript";
import specyService from "@/services/SpecyService";

defineProps({
  specy: {
    default: specyScript.init(),
  },
});
</script>
