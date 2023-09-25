<template>
  <header>
    <div class="card relative z-2">
      <Menubar :model="menuItems" />
    </div>
  </header>
  <main>
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import Menubar from "primevue/menubar";
import { ref } from "vue";
import router from "./router";

const menuItems = ref([
  {
    label: "Home",
    icon: "pi pi-fw pi-home",
    command: () => {
      router.push({ path: "/" });
    },
  },
  {
    label: "Workspace",
    icon: "pi pi-fw pi-desktop",
    command: () => {
      router.push({ path: "/workspace" });
    },
  },
  {
    label: "Account",
    items: [
      {
        label: "Sign-up",
        icon: "pi pi-fw pi-user",
        command: () => {
          router.push({ path: "/signup" });
        },
      },
      {
        label: "Profil",
        icon: "pi pi-fw pi-user",
        command: () => {
          router.push({ path: "/profil" });
        },
      },
      {
        label: "Log-in",
        icon: "pi pi-fw pi-sign-in",
        command: () => {
          router.push({ path: "/login" });
        },
      },
      { label: "Log-out", icon: "pi pi-fw pi-sign-out" },
    ],
  },
]);
</script>
