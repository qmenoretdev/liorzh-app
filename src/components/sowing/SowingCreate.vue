<template>
  <div>
    <SowingForm
      :header="$t('sowing.createTitle')"
      :apiErrors="apiErrors"
      :loading="loadingForm"
      @submit="createSowing"
      @quit="quit()"
    />
  </div>
</template>

<script setup lang="ts">
import type { ApiError } from "@/models/ApiError";
import type { Sowing } from "@/models/Sowing";
import router from "@/router";
import sowingService from "@/services/SowingService";
import responseService from "@/services/ResponseService";
import { ref } from "vue";
import SowingForm from "@/components/sowing/SowingForm.vue";
import { useSowingStore } from "@/stores/sowing";

const sowingStore = useSowingStore();
const loadingForm = ref(false);
const apiErrors = ref([] as ApiError[]);

async function createSowing(sowing: Sowing) {
  loadingForm.value = true;
  try {
    const createdSowing = await sowingService.createSowing(sowing);
    if (createdSowing) {
      sowingStore.userSowings.push(createdSowing);
      quit();
    } else {
      apiErrors.value = [
        { message: t("message.sowing.createError"), code: "", level: "error" },
      ];
    }
  } catch (error: any) {
    apiErrors.value = responseService.getApiErrors(error);
  }
  loadingForm.value = false;
}

function quit() {
  router.go(-1);
}
</script>
