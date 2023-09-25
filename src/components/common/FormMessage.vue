<template>
  <div :class="cssClass.formMessage.default + ' ' + additionnalClass + ' ' + severity">
    {{ message }}
  </div>
</template>

<script setup lang="ts">
import { cssClass } from "@/utils/style";

defineProps({
  message: {
    default: "",
  },
  severity: {
    default: "error",
  },
  additionnalClass: {
    default: "col-offset-3",
  },
});
</script>
