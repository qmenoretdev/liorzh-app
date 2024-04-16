<template>
  <div class="grid col-12">
    <div class="col-12 lg:col-2">
      <Menu :model="menuItems" />
    </div>
    <div class="col-12 lg:col-10" v-if="userStore.user.id !== 0">
      <RouterView v-slot="{ Component }">
        <keep-alive :exclude="keepAliveExcludes"
          ><component :is="Component"
        /></keep-alive>
      </RouterView>
    </div>
  </div>
</template>

<script setup lang="ts">
import Menu from "primevue/menu";
import { computed, ref } from "vue";
import { RouterView } from "vue-router";
import { useI18n } from "vue-i18n";
import { useUserStore } from "@/stores/user";
const { t } = useI18n();
const userStore = useUserStore();
import router from "@/router";

const keepAliveExcludes = ref([
  "MonitoringUpdate",
  "MonitoringCreate",
  "MonitoringLineUpdate",
  "MonitoringLineCreate",
]);

const menuItems = computed(() => [
  {
    label: userStore.activeProjectUser.project.name,
    items: [
      {
        label: t("navigation.monitoring"),
        icon: "pi pi-fw pi-chart-bar",
        command: () => {
          router.push({ name: "MonitoringPanel" });
        },
      },
      {
        label: t("navigation.variety"),
        icon: "pi pi-fw pi-apple",
        command: () => {
          router.push({ name: "VarietyPanel" });
        },
      },
      {
        label: t("navigation.sowing"),
        icon: "pi pi-fw pi-database",
        command: () => {
          router.push({ name: "SowingPanel" });
        },
      },
    ],
  },
]);
</script>
