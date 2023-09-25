<template>
  <SignupForm @register="register" :apiErrors="apiErrors" />
</template>

<script setup lang="ts">
import SignupForm from "@/components/user/SignupForm.vue";
import type { User } from "@/models/User";
import userService from "@/services/UserService";
import responseService from "@/services/ResponseService";
import { ref } from "vue";
import type { ApiError } from "@/models/ApiError";
import router from "@/router";
import { useUserStore } from "@/stores/user";

const apiErrors = ref([] as ApiError[]);

async function register(user: User) {
  try {
    apiErrors.value = [];
    const userCreated = await userService.register(user);
    if (userCreated) {
      const userStore = useUserStore();
      userStore.setUser(userCreated);
      router.push({ path: "/login" });
    }
  } catch (error: any) {
    apiErrors.value = responseService.getApiErrors(error);
  }
}
</script>
