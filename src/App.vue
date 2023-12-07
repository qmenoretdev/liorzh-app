<template>
  <header>
    <div class="card relative z-2">
      <Menubar :model="menuItems" />
    </div>
  </header>
  <main class="mt-2">
    <RouterView />
  </main>
  <ConfirmDialog />
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import Menubar from "primevue/menubar";
import { computed, onMounted } from "vue";
import router from "./router";
import { useAuthStore } from "@/stores/auth";
import { useUserStore } from "@/stores/user";
import userService from "@/services/UserService";
import ConfirmDialog from "primevue/confirmdialog";

const authStore = useAuthStore();
const userStore = useUserStore();

// Get user if authenticated
onMounted(async () => {
  if (authStore.authenticated && userStore.user.id === 0) {
    const user = await userService.getUser();
    userStore.setUser(user);
  }
});

// Menu
const menuItems = computed(() => [
  {
    label: "Home",
    icon: "pi pi-fw pi-home",
    command: () => {
      router.push({ name: "home" });
    },
  },
  {
    label: "Workspace",
    icon: "pi pi-fw pi-desktop",
    command: () => {
      router.push({ name: "workspace" });
    },
    visible: authStore.authenticated,
  },
  {
    label: "Account",
    items: [
      {
        label: "Sign-up",
        icon: "pi pi-fw pi-user",
        command: () => {
          router.push({ name: "signup" });
        },
        visible: !authStore.authenticated,
      },
      {
        label: "Profil",
        icon: "pi pi-fw pi-id-card",
        command: () => {
          router.push({ name: "profil" });
        },
        visible: authStore.authenticated,
      },
      {
        label: "Log-in",
        icon: "pi pi-fw pi-sign-in",
        command: () => {
          router.push({ name: "login" });
        },
        visible: !authStore.authenticated,
      },
      {
        label: "Log-out",
        icon: "pi pi-fw pi-sign-out",
        visible: authStore.authenticated,
        command: () => {
          authStore.logout();
          router.push({ name: "home" });
        },
      },
    ],
  },
]);
</script>
