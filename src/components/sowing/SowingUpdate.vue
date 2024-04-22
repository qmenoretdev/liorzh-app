<template>
  <div>
    <SowingForm
      v-show="!loading"
      :header="$t('sowing.updateTitle')"
      :sowingToUpdate="sowing"
      :apiErrors="apiErrors"
      :loading="loadingForm"
      :submitButtonLabel="'Modifier'"
      @submit="updateSowing"
      @quit="quit()"
    />
    <LoadingSpinner v-if="loading" />
  </div>
</template>

<script setup lang="ts">
import type { ApiError } from "@/models/ApiError";
import type { Sowing } from "@/models/Sowing";
import router from "@/router";
import sowingService from "@/services/SowingService";
import responseService from "@/services/ResponseService";
import { ref, onMounted } from "vue";
import LoadingSpinner from "@/components/common/LoadingSpinner.vue";
import sowingScript from "@/scripts/SowingScript";
import SowingForm from "@/components/sowing/SowingForm.vue";
import { useSowingStore } from "@/stores/sowing";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const sowingStore = useSowingStore();

const loadingForm = ref(false);
const apiErrors = ref([] as ApiError[]);
const sowing = ref(sowingScript.init());
const loading = ref(true);

const props = defineProps({
  id: {
    default: 0,
  },
});

onMounted(async () => {
  sowing.value = await sowingService.getSowing(props.id);
  loading.value = false;
});

async function updateSowing(sowing: Sowing) {
  try {
    loadingForm.value = true;
    const isUpdated = await sowingService.updateSowing(sowing);
    if (!isUpdated) {
      apiErrors.value = [
        { message: t("message.sowing.updateError"), code: "", level: "error" },
      ];
    } else {
      sowingStore.userSowings.forEach((sowingIn: Sowing, i: number) => {
        if (sowing.id === sowingIn.id) {
          sowingStore.userSowings[i] = sowing;
        }
      });
      quit();
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
