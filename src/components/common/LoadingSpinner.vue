<template>
  <div class="grid col-12">
    <ProgressSpinner
      style="width: 50px; height: 50px"
      strokeWidth="8"
      fill="var(--surface-ground)"
      animationDuration="1s"
      aria-label="Custom ProgressSpinner"
    />
  </div>
</template>

<script setup lang="ts">
import ProgressSpinner from "primevue/progressspinner";
</script>
