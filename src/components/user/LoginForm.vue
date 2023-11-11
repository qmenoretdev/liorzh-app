<template>
  <div class="card p-4 col-12 lg:col-4 mx-auto">
    <div :class="cssClass.container.default">
      <InlineMessage class="col-12 mb-2" v-if="user.id !== 0" severity="success"
        >Bienvenue {{ user.name }} ! Vous pouvez vous authentifier.</InlineMessage
      >
      <h2>Log-in</h2>
      <div class="field grid">
        <label for="email" class="col-12 sm:col-3">Email</label>
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
        <label for="password" class="col-12 sm:col-3">Password</label>
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
          label="Log-in"
          @click="login()"
          class="col-4 md:col-3 col-offset-4 button-create"
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

const userStore = useUserStore();

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
    formError.value.usernameError = "Email is required";
    checkOk = false;
  }
  if (formLogin.value.password === "" || formLogin.value.password == undefined) {
    formError.value.passwordError = "Password is required";
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
@/models/form/FormLogin