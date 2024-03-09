<template>
  <LoginForm @login="login" :apiErrors="apiErrors" :loading="loading" />
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
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const loading = ref(false);

const apiErrors = ref([] as ApiError[]);

async function login(formLogin: FormLogin) {
  try {
    loading.value = true;
    apiErrors.value = [];
    await userService.login(formLogin.username, formLogin.password);
    getUser();
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.code === 401) {
      apiErrors.value = [
        {
          message: t('message.login.error'),
          code: "ERR_CREDENTIALS",
          level: "error",
        },
      ];
    } else {
      apiErrors.value = responseService.getApiErrors(error);
    }
  }
  loading.value = false;
}
async function getUser() {
  if (authStore.authenticated) {
    try {
      const user = await userService.getUser();
      userStore.setUser(user);
      if (userStore.activeProjectUser.id !== 0) {
        router.push({ path: "/workspace" });
      } else {
        router.push({ path: "/project" });
      }
    } catch (error: any) {
      apiErrors.value = responseService.getApiErrors(error);
    }
  }
}
</script>