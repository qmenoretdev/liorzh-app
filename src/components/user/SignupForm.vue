<template>
  <div class="card p-4 col-12 lg:col-4 mx-auto">
    <div :class="cssClass.container.default">
      <h2>Sign-up</h2>
      <div class="field grid">
        <label for="name" class="col-12 sm:col-3">Pseudo*</label>
        <div class="col-12 sm:col-8">
          <input
            id="name"
            placeholder="Pseudo"
            type="text"
            :class="getInputClass(formError.nameError)"
            v-model="user.name"
            @keyup.enter="register()"
          />
        </div>
        <FormMessage :message="formError.nameError" />
      </div>
      <div class="field grid">
        <label for="email" class="col-12 sm:col-3">Email*</label>
        <div class="col-12 sm:col-8">
          <input
            id="email"
            placeholder="Email"
            type="text"
            :class="getInputClass(formError.emailError)"
            v-model="user.email"
            @keyup.enter="register()"
          />
        </div>
        <FormMessage :message="formError.emailError" />
      </div>
      <div class="field grid">
        <label for="password" class="col-12 sm:col-3">Password*</label>
        <div class="col-12 sm:col-8">
          <input
            id="password"
            placeholder="Password"
            type="password"
            :class="getInputClass(formError.passwordError)"
            v-model="user.password"
            @keyup.enter="register()"
          />
        </div>
        <FormMessage :message="formError.passwordError" />
      </div>
      <div class="field grid">
        <label for="password" class="col-12 sm:col-3">Repeat Password*</label>
        <div class="col-12 sm:col-8">
          <input
            id="password"
            placeholder="Repeat Password"
            type="password"
            :class="getInputClass(formError.passwordError)"
            v-model="repeatPassword"
            @keyup.enter="register()"
          />
        </div>
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
          label="Sign-up"
          @click="register()"
          class="col-4 md:col-3 col-offset-4"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InlineMessage from "primevue/inlinemessage";
import Button from "primevue/button";
import { ref } from "vue";
import { cssClass, getInputClass } from "@/utils/style";
import userScript from "@/scripts/UserScript";
import type { ApiError } from "@/models/ApiError";
import FormMessage from "@/components/common/FormMessage.vue";

defineProps({
  apiErrors: {
    default: [] as ApiError[],
  },
});
const emit = defineEmits(["register"]);

const user = ref(userScript.init());
const repeatPassword = ref("");

const formError = ref(initFormError());

function register(): void {
  if (checkForm()) {
    emit("register", user.value);
  }
}

function checkForm(): boolean {
  formError.value = initFormError();
  let checkOk = true;
  if (user.value.name === "" || user.value.name == undefined) {
    formError.value.nameError = "Pseudo is required";
    checkOk = false;
  }
  if (user.value.email === "" || user.value.email == undefined) {
    formError.value.emailError = "Email is required";
    checkOk = false;
  }
  if (user.value.password === "" || user.value.password == undefined) {
    formError.value.passwordError = "Password is required";
    checkOk = false;
  } else {
    if (user.value.password !== repeatPassword.value) {
      formError.value.passwordError = "Passwords are not identical";
      checkOk = false;
    }
  }
  return checkOk;
}

function initFormError() {
  return {
    nameError: "",
    emailError: "",
    passwordError: "",
  };
}
</script>
