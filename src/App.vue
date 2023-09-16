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
import { RouterLink, RouterView } from "vue-router";
import Menubar from "primevue/menubar";
import { ref } from "vue";
import router from "./router";

const menuItems = ref([
  {
    label: "Accueil",
    icon: "pi pi-fw pi-home",
    command: () => {
      router.push({ path: "/" });
    },
  },
  {
    label: "Espace de travail",
    icon: "pi pi-fw pi-desktop",
    command: () => {
      router.push({ path: "/workspace" });
    },
  },
  {
    label: "Compte",
    items: [
      {
        label: "S'inscrire",
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
        label: "Connexion",
        icon: "pi pi-fw pi-sign-in",
        command: () => {
          router.push({ path: "/login" });
        },
      },
      { label: "Déconnexion", icon: "pi pi-fw pi-sign-out" },
    ],
  },
]);
</script>
