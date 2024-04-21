<template>
  <VarietyForm
    :header="$t('variety.createTitle')"
    :proposedVariety="proposedVariety"
    :apiErrors="apiErrors"
    :loading="loadingForm"
    @submit="createVariety"
    @addVarietyToProject="addVarietyToProject"
    @quit="quit()"
  />
</template>

<script setup lang="ts">
import type { ApiError } from "@/models/ApiError";
import type { Variety } from "@/models/Variety";
import router from "@/router";
import varietyService from "@/services/VarietyService";
import responseService from "@/services/ResponseService";
import { ref } from "vue";
import VarietyForm from "@/components/variety/VarietyForm.vue";
import { useVarietyStore } from "@/stores/variety";
import varietyScript from "@/scripts/VarietyScript";
import specyService from "@/services/SpecyService";
import type { ToastMessageOptions } from "primevue/toast";
import toastService from "@/services/ToastService";
import { useUserStore } from "@/stores/user";
import projectService from "@/services/ProjectService";
import { useToast } from "primevue/usetoast";

const toast = useToast();

const userStore = useUserStore();

const varietyStore = useVarietyStore();
const loadingForm = ref(false);
const apiErrors = ref([] as ApiError[]);
// Variété proposée si l'utilisateur souhaite créé une variété du même ID
const proposedVariety = ref(varietyScript.init() as Variety);

async function addVarietyToProject(variety: Variety) {
  try {
    const isAdd = await projectService.addVarietyToProject(
      userStore.activeProjectUser.project,
      variety
    );
    if (!isAdd) {
      toast.add(
        toastService.showError(
          "Impossible d'ajouter la variété !",
          variety.specy.botanicalName + " " + variety.name
        )
      );
    } else {
      varietyStore.userVarieties.push(variety);
      toast.add(
        toastService.showSuccess(
          "Variété ajoutée !",
          variety.specy.botanicalName + " " + variety.name
        )
      );
      quit();
    }
  } catch (error) {
    const toastOptions = toastService.getToastOptions(
      "Impossible d'ajouter cette variété",
      responseService.getApiErrors(error)
    );
    toastOptions.forEach((toastOption: ToastMessageOptions) => {
      toast.add(toastOption);
    });
  }
}

async function createVariety(variety: Variety) {
  loadingForm.value = true;
  try {
    if (variety.specy.id === 0) {
      const specy = await specyService.createSpecy(variety.specy);
      if (specy) {
        variety.specy = specy;
      } else {
        throw {
          code: "",
          message: "Impossible de créer l'espèce " + variety.specy.botanicalName,
          level: "error",
        } as ApiError;
      }
    }
  } catch (error: any) {
    if (responseService.isConflict(error)) {
      variety.specy = error.response.data;
    } else {
      apiErrors.value = responseService.getApiErrors(error);
    }
  }
  try {
    const createdVariety = await varietyService.createVariety(variety);
    if (createdVariety) {
      varietyStore.userVarieties.push(createdVariety);
      quit();
    } else {
      apiErrors.value = [
        { message: "Impossible de créer la variété", code: "", level: "error" },
      ];
    }
  } catch (error: any) {
    if (responseService.isConflict(error)) {
      proposedVariety.value = error.response.data;
      apiErrors.value = [
        { message: "Cette variété existe déjà", code: "", level: "warn" },
      ];
    } else {
      apiErrors.value = responseService.getApiErrors(error);
    }
  }
  loadingForm.value = false;
}

function quit() {
  router.go(-1);
}
</script>
