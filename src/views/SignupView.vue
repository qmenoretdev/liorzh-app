<template>
  <SignupForm @register="register" :messages="messages" />
</template>

<script setup lang="ts">
import SignupForm from "@/components/user/SignupForm.vue";
import type { User } from "@/models/User";
import userService from "@/services/UserService";
import responseService from "@/services/ResponseService";
import { ref } from "vue";

const messages = ref([] as string[]);

async function register(user: User) {
  try {
    const userCreated = await userService.register(user);
    messages.value = [];
    console.log(userCreated);
  } catch (error: any) {
    messages.value = responseService.getErrorMessages(error);
  }
}
</script>
