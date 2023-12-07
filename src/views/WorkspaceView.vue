<template>
  <div class="grid col-12">
    <div class="col-12 lg:col-2">
      <Menu :model="menuItems" />
    </div>
    <div class="col-12 lg:col-10">
      <MonitoringPanel v-show="workspaceStore.selectedItemNumber === 0" />
      <VarietyPanel v-show="workspaceStore.selectedItemNumber === 1" />
      <SowingPanel v-show="workspaceStore.selectedItemNumber === 2" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Menu from "primevue/menu";
import { computed } from "vue";
import MonitoringPanel from "@/components/monitoring/MonitoringPanel.vue";
import VarietyPanel from "@/components/variety/VarietyPanel.vue";
import SowingPanel from "@/components/sowing/SowingPanel.vue";
import { useWorkspaceStore } from "@/stores/workspace";
const workspaceStore = useWorkspaceStore();

const menuItems = computed(() => [
  {
    label: "Workspace",
    items: [
      {
        label: "Suivi",
        icon: "pi pi-fw pi-chart-bar",
        command: () => {
          workspaceStore.setSelectedItemNumber(0);
        },
      },
      {
        label: "Variétés",
        icon: "pi pi-fw pi-apple",
        command: () => {
          workspaceStore.setSelectedItemNumber(1);
        },
      },
      {
        label: "Semis",
        icon: "pi pi-fw pi-database",
        command: () => {
          workspaceStore.setSelectedItemNumber(2);
        },
      },
    ],
  },
]);
</script>
