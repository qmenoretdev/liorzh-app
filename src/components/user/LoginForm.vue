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
            placeholder="Email"
            type="text"
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
            placeholder="Password"
            type="password"
            :class="getInputClass(formError.passwordError)"
            v-model="formLogin.password"
            @keyup.enter="login()"
          />
        </div>
        <FormMessage :message="formError.passwordError" />
      </div>
      <InlineMessage class="col-12 mb-1" v-if="formError.serverError !== ''">{{
        formError.serverError
      }}</InlineMessage>
      <div class="col-12">
        <Button
          rounded
          label="Log-in"
          @click="login()"
          class="col-4 md:col-3 col-offset-4"
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
import userService from "@/services/UserService";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();

const emit = defineEmits(["authenticated"]);
const user = computed(() => userStore.user);

const formLogin = ref({
  username: "",
  password: "",
});

const formError = ref(initFormError());

async function login(): Promise<void> {
  if (checkForm()) {
    try {
      const isAuthenticated = await userService.login(
        formLogin.value.username,
        formLogin.value.password
      );
      emit("authenticated", isAuthenticated);
    } catch (error: any) {
      if (error.response.data) {
        if (error.response.data.code === 401) {
          formError.value.serverError = "Incorrect email or password.";
        } else {
          formError.value.serverError = error.response.data.message;
        }
      } else {
        // No response from server
        formError.value.serverError = error.message;
      }
    }
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
    serverError: "",
  };
}
</script>
