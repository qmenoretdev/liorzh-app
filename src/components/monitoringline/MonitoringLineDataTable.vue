<template>
    <div>
        {{ props.monitoringLines }}
    </div>
</template>

<script setup lang="ts">
import type { MonitoringLine } from "@/models/MonitoringLine";

const props = defineProps({
  monitoringLines: {
    default: [] as MonitoringLine[],
  },
});
</script>