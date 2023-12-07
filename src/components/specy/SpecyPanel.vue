<template>
  <div :class="cssClass.container.default">
    <h2>Espèces</h2>
    <Button
      rounded
      label="Nouvelle espèce"
      icon="pi pi-plus-circle"
      @click="specyCreationVisible = true"
    />
    <div>
      <SpecyForm
        :header="'Création d\'une espèce'"
        :visible="specyCreationVisible"
        :apiErrors="apiErrors"
        :loading="loadingForm"
        @submit="createSpecy"
        @close="closeModal()"
      />
      <SpecyForm
        :header="'Modification d\'une espèce'"
        :specyToUpdate="selectedSpecy"
        :visible="specyUpdateVisible"
        :apiErrors="apiErrors"
        :loading="loadingForm"
        :submitButtonLabel="'Modifier'"
        @submit="updateSpecy"
        @close="closeModal()"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Button from "primevue/button";
import type { ApiError } from "@/models/ApiError";
import { useConfirm } from "primevue/useconfirm";
import specyScript from "@/scripts/SpecyScript";
import type { Specy } from "@/models/Specy";
import specyService from "@/services/SpecyService";
import responseService from "@/services/ResponseService";
import { defaultConfirmDialogOptions } from "@/scripts/CommonScript";
import SpecyForm from "@/components/specy/SpecyForm.vue";
import { cssClass } from "@/utils/style";

const apiErrors = ref([] as ApiError[]);
const loadingForm = ref(false);
const specyCreationVisible = ref(false);
const specyUpdateVisible = ref(false);
const confirm = useConfirm();
const selectedSpecy = ref(specyScript.init());

function closeModal() {
  specyCreationVisible.value = false;
  specyUpdateVisible.value = false;
}
async function createSpecy(specy: Specy) {
  try {
    loadingForm.value = true;
    const createdSpecy = await specyService.createSpecy(specy);
    if (createdSpecy) {
      closeModal();
      //specyStore.specys.push(createdSpecy);
    } else {
      apiErrors.value = [
        { message: "Impossible de créer l'espèce", code: "", level: "error" },
      ];
    }
  } catch (error: any) {
    apiErrors.value = responseService.getApiErrors(error);
  }
  loadingForm.value = false;
}
async function updateSpecy(specy: Specy) {
  try {
    loadingForm.value = true;
    const isUpdated = await specyService.updateSpecy(specy);
    if (!isUpdated) {
      apiErrors.value = [
        { message: "Impossible de modifier l'espèce", code: "", level: "error" },
      ];
    } else {
      specyUpdateVisible.value = false;
    }
  } catch (error: any) {
    apiErrors.value = responseService.getApiErrors(error);
  }
  loadingForm.value = false;
}
async function deleteSpecy(id: number) {
  let confirmDialog = defaultConfirmDialogOptions;
  confirmDialog.message = "Etes-vous certain de vouloir supprimer cette espèce ?";
  confirmDialog.accept = async () => {
    try {
      const isDeleted = await specyService.deleteSpecy(id);
      if (!isDeleted) {
        apiErrors.value = [
          {
            message: "Impossible de supprimer l'espèce",
            code: "",
            level: "error",
          },
        ];
      } else {
        //specyStore.setSpecys(specyStore.specys.filter((specy: Specy) => specy.id !== id));
      }
    } catch (error: any) {
      apiErrors.value = responseService.getApiErrors(error);
    }
  };
  confirm.require(confirmDialog);
}
function selectSpecy(specy: Specy) {
  /* if (
    specyStore.selectedSpecys.find((specyInStore: Specy) => specyInStore.id === specy.id)
  ) {
    specyStore.setSelectedSpecys(
      specyStore.selectedSpecys.filter(
        (specyInStore: Specy) => specyInStore.id !== specy.id
      )
    );
  } else {
    specyStore.selectedSpecys.push(specy);
  }*/
}
</script>
