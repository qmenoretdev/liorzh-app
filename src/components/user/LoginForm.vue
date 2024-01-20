<template>
  <div class="card p-4 col-12 lg:col-4 mx-auto">
    <div :class="cssClass.container.default">
      <InlineMessage class="col-12 mb-2" v-if="justSignup" severity="success"
        >{{ $t('message.signup.success', { name: user.name }) }}</InlineMessage
      >
      <InlineMessage class="col-12 mb-2" v-else-if="jwtExpiration" severity="info"
        >{{ $t('message.login.jwtExpiration', { name: user.name }) }}</InlineMessage
      >
      <h2>{{ $t('login.title') }}</h2>
      <div class="field grid">
        <label for="email" class="col-12 sm:col-3">{{ $t('login.email') }}</label>
        <div class="col-12 sm:col-8">
          <input
            id="email"
            placeholder="example@mail.com"
            type="email"
            :class="getInputClass(formError.usernameError)"
            v-model="formLogin.username"
            @keyup.enter="login()"
          />
        </div>
        <FormMessage :message="formError.usernameError" />
      </div>
      <div class="field grid">
        <label for="password" class="col-12 sm:col-3">{{ $t('login.password') }}</label>
        <div class="col-12 sm:col-8">
          <input
            id="password"
            placeholder="xxx"
            type="password"
            :class="getInputClass(formError.passwordError)"
            v-model="formLogin.password"
            @keyup.enter="login()"
          />
        </div>
        <FormMessage :message="formError.passwordError" />
      </div>
      <InlineMessage
        class="col-12 mb-1"
        v-for="apiError in apiErrors"
        :key="apiError"
        :severity="apiError.level"
        >{{ apiError.message }}</InlineMessage
      >
      <div class="col-12">
        <Button
          rounded
          :label="$t('login.to')"
          @click="login()"
          class="col-6 md:col-6 col-offset-3"
          :loading="loading"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InlineMessage from "primevue/inlinemessage";
import Button from "primevue/button";
import FormMessage from "@/components/common/FormMessage.vue";
import { computed, ref } from "vue";
import { cssClass, getInputClass } from "@/utils/style";
import { useUserStore } from "@/stores/user";
import type { ApiError } from "@/models/ApiError";
import type { FormLogin } from "@/models/FormLogin";
import { useI18n } from "vue-i18n";
import {useRoute} from "vue-router";
import { queryParams } from "@/utils/queryParams";

const { t } = useI18n();
const userStore = useUserStore();
const context = useRoute().query.context;

defineProps({
  apiErrors: {
    default: [] as ApiError[],
  },
  loading: {
    default: false,
  },
});
const emit = defineEmits(["login"]);
// If redirection after registration display the welcome message
const user = computed(() => userStore.user);
const justSignup = context === queryParams.loginForm.context.signup;
const jwtExpiration = context === queryParams.loginForm.context.jwtExpiration;

const formLogin = ref({
  username: "",
  password: "",
} as FormLogin);

const formError = ref(initFormError());

async function login(): Promise<void> {
  if (checkForm()) {
    emit("login", formLogin.value);
  }
}

function checkForm(): boolean {
  formError.value = initFormError();
  let checkOk = true;
  if (formLogin.value.username === "" || formLogin.value.username == undefined) {
    formError.value.usernameError = t('message.login.emailError');
    checkOk = false;
  }
  if (formLogin.value.password === "" || formLogin.value.password == undefined) {
    formError.value.passwordError = t('message.login.passwordError');
    checkOk = false;
  }
  return checkOk;
}

function initFormError() {
  return {
    usernameError: "",
    passwordError: "",
  };
}
</script>
