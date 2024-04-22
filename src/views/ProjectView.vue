<template>
  <div>
    <div style="text-align: center">
      <h1>Projets</h1>
    </div>
    <RouterView v-slot="{ Component }">
      <keep-alive :exclude="keepAliveExcludes"><component :is="Component" /></keep-alive>
    </RouterView>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const keepAliveExcludes = ref(["ProjectUpdate", "ProjectCreate", "ProjectAddUser"]);
</script>
