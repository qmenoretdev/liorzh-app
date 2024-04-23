<template>
  <VarietyForm
    v-show="!loading"
    :header="$t('variety.updateTitle')"
    :varietyToUpdate="variety"
    :apiErrors="apiErrors"
    :loading="loadingForm"
    :submitButtonLabel="$t('button.update')"
    @submit="updateVariety"
    @quit="quit()"
  />
  <LoadingSpinner v-if="loading" />
</template>

<script setup lang="ts">
import type { ApiError } from "@/models/ApiError";
import type { Variety } from "@/models/Variety";
import router from "@/router";
import varietyService from "@/services/VarietyService";
import responseService from "@/services/ResponseService";
import { ref } from "vue";
import LoadingSpinner from "@/components/common/LoadingSpinner.vue";
import { onMounted } from "vue";
import varietyScript from "@/scripts/VarietyScript";
import VarietyForm from "@/components/variety/VarietyForm.vue";

const loadingForm = ref(false);
const apiErrors = ref([] as ApiError[]);
const variety = ref(varietyScript.init());
const loading = ref(true);

const props = defineProps({
  id: {
    default: 0,
  },
});

onMounted(async () => {
  variety.value = await varietyService.getVariety(props.id);
  loading.value = false;
});

async function updateVariety(variety: Variety) {
  try {
    loadingForm.value = true;
    const isUpdated = await varietyService.updateVariety(variety);
    if (!isUpdated) {
      apiErrors.value = [
        { message: "Impossible de modifier la variété", code: "", level: "error" },
      ];
    } else {
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
