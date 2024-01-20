<template>
  <SignupForm @register="register" :apiErrors="apiErrors" :loading="loading" />
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
import { queryParams } from "@/utils/queryParams";

const apiErrors = ref([] as ApiError[]);

const loading = ref(false);

async function register(user: User) {
  try {
    loading.value = true;
    apiErrors.value = [];
    const userCreated = await userService.register(user);
    if (userCreated) {
      const userStore = useUserStore();
      userStore.setUser(userCreated);
      router.push({ path: "/login", query: { context: queryParams.loginForm.context.signup }});
    }
  } catch (error: any) {
    apiErrors.value = responseService.getApiErrors(error);
  }
  loading.value = false;
}
</script>
