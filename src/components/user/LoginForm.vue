<template>
  <div class="card col-12 lg:col-6">
    <div class="field grid">
      <label for="email" class="col-12 sm:col-2">Email</label>
      <div class="col-12 sm:col-6">
        <input
          id="email"
          placeholder="Email"
          type="text"
          :class="getInputClass(formError.usernameError)"
          v-model="formLogin.username"
        />
      </div>
      <InlineMessage class="col-12 sm:col-4" v-if="formError.usernameError !== ''">{{
        formError.usernameError
      }}</InlineMessage>
    </div>
    <div class="field grid">
      <label for="password" class="col-12 sm:col-2">Password</label>
      <div class="col-12 sm:col-6">
        <input
          id="password"
          placeholder="Password"
          type="password"
          :class="getInputClass(formError.passwordError)"
          v-model="formLogin.password"
        />
      </div>
      <InlineMessage class="col-12 sm:col-4" v-if="formError.passwordError !== ''">{{
        formError.passwordError
      }}</InlineMessage>
    </div>
    <Button rounded label="Log-in" @click="login()" class="col-4 md:col-2" />
  </div>
</template>

<script setup lang="ts">
import InlineMessage from "primevue/inlinemessage";
import Button from "primevue/button";
import { ref } from "vue";

const formLogin = ref({
  username: "",
  password: "",
});

const formError = ref(initFormError());

function login() {
  if (checkForm()) {
    console.log("OK");
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

function getInputClass(error: string): string {
  let cssClass =
    "text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full";
  return cssClass + (error !== "" ? " p-invalid" : "");
}
</script>
