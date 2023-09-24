<template>
  <LoginForm @authenticated="authenticated" />
</template>

<script setup lang="ts">
import LoginForm from "@/components/user/LoginForm.vue";
import router from "@/router";

function authenticated(isAuthenticated: boolean) {
  if (isAuthenticated) {
    router.push({ path: "/workspace" });
  }
}
</script>
