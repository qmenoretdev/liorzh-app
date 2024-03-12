<template>
  <div>Profil page</div>
  <div>{{ userStore.user }}</div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
</script>
