<template>
  <LoginForm @login="login" :apiErrors="apiErrors" />
</template>

<script setup lang="ts">
import LoginForm from "@/components/user/LoginForm.vue";
import type { ApiError } from "@/models/ApiError";
import type { FormLogin } from "@/models/FormLogin";
import router from "@/router";
import userService from "@/services/UserService";
import { useAuthStore } from "@/stores/auth";
import { ref } from "vue";
import responseService from "@/services/ResponseService";
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();
const authStore = useAuthStore();

const apiErrors = ref([] as ApiError[]);

async function login(formLogin: FormLogin) {
  try {
    await userService.login(formLogin.username, formLogin.password);
    getUser();
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.code === 401) {
      apiErrors.value = [
        {
          message: "Incorrect email or password.",
          code: "ERR_CREDENTIALS",
          level: "error",
        },
      ];
    } else {
      apiErrors.value = responseService.getApiErrors(error);
    }
  }
}
async function getUser() {
  if (authStore.authenticated) {
    try {
      userStore.setUser(await userService.getUser());
      router.push({ path: "/workspace" });
    } catch (error: any) {
      apiErrors.value = responseService.getApiErrors(error);
    }
  }
}
</script>
