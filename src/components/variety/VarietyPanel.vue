<template>
  <div class="grid">
    <Accordion :multiple="true" :activeIndex="[0]" class="col-12">
      <AccordionTab>
        <template #header>
          <h2 class="p-0 m-0">Mes Variétés</h2>
        </template>
        <div class="mt-0 mb-2">
          <Button
            class="button-create"
            label="Nouvelle variété"
            icon="pi pi-plus-circle"
            @click="varietyCreationVisible = true"
            style="max-height: 2rem"
          />
          <InlineMessage
            class="col-12 mb-1"
            v-for="apiError in apiErrors"
            :key="apiError"
            :severity="apiError.level"
            >{{ apiError.message }}</InlineMessage
          >
        </div>
        <div v-if="!loading">
          <div v-if="varietyStore.userVarieties.length === 0">
            <InlineMessage class="col-12 mb-1" severity="info"
              >Vous n'avez pas encore de variétés. Vous pouvez rechercher dans les
              variétés publiées les variétés existantes. Sinon vous pouvez en ajouter
              une.</InlineMessage
            >
          </div>
          <div v-else>
            <VarietyDataTable
              :data="varietyStore.userVarieties"
              :editable="true"
              @delete="deleteVariety"
              @update="openUpdateForm"
            />
          </div>
        </div>
        <LoadingSpinner v-else />
      </AccordionTab>
      <AccordionTab>
        <template #header>
          <h2 class="public-object-text p-0 m-0">Variétés publiées</h2>
        </template>
        <div :class="cssClass.container.default + ' col-12'">
          <SearchVarietyComponent class="col-12" @submit="searchVarieties" />
          <VarietyDataTable
            :data="searchedVarieties"
            :editable="false"
            :addable="true"
            @addToUser="addUserToVariety"
          />
        </div>
      </AccordionTab>
    </Accordion>
    <VarietyForm
      :header="'Création d\'une variété'"
      :proposedVariety="proposedVariety"
      :visible="varietyCreationVisible"
      :apiErrors="apiErrors"
      :loading="loadingForm"
      @submit="createVariety"
      @addUserToVariety="addUserToVariety"
      @close="closeModal()"
    />
    <VarietyForm
      :header="'Modification d\'une variété'"
      :varietyToUpdate="varietyToUpdate"
      :visible="varietyUpdateVisible"
      :apiErrors="apiErrors"
      :loading="loadingForm"
      :submitButtonLabel="'Modifier'"
      @submit="updateVariety"
      @close="closeModal()"
    />
  </div>
</template>

<script setup lang="ts">
import varietyService from "@/services/VarietyService";
import { useVarietyStore } from "@/stores/variety";
import { cssClass } from "@/utils/style";
import { onMounted, ref } from "vue";
import LoadingSpinner from "@/components/common/LoadingSpinner.vue";
import Button from "primevue/button";
import SearchVarietyComponent from "@/components/variety/SearchVariety.vue";
import VarietyForm from "@/components/variety/VarietyForm.vue";
import type { ApiError } from "@/models/ApiError";
import varietyScript from "@/scripts/VarietyScript";
import { useConfirm } from "primevue/useconfirm";
import type { Variety } from "@/models/Variety";
import responseService from "@/services/ResponseService";
import specyService from "@/services/SpecyService";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import InlineMessage from "primevue/inlinemessage";
import type { SearchVariety } from "@/models/request/search/SearchVariety";
import { defaultConfirmDialogOptions } from "@/scripts/CommonScript";
import VarietyDataTable from "@/components/variety/VarietyDataTable.vue";

const loading = ref(false);
const apiErrors = ref([] as ApiError[]);
const loadingForm = ref(false);
const varietyStore = useVarietyStore();
const varietyCreationVisible = ref(false);
const varietyUpdateVisible = ref(false);
// Variété proposée si l'utilisateur souhaite créé une variété du même ID
const proposedVariety = ref(varietyScript.init() as Variety);
// Variété passé en prop pour mise à jour
const varietyToUpdate = ref(varietyScript.init() as Variety);

const confirm = useConfirm();
const searchedVarieties = ref([] as Variety[]);

onMounted(async () => {
  getUserVarieties();
});

async function getUserVarieties() {
  loading.value = true;
  const varieties = await varietyService.getVarietiesByCurrentUser();
  varietyStore.setUserVarieties(varieties);
  loading.value = false;
}

function closeModal() {
  varietyCreationVisible.value = false;
  varietyUpdateVisible.value = false;
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
      closeModal();
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
function openUpdateForm(variety: Variety) {
  varietyToUpdate.value = variety;
  varietyUpdateVisible.value = true;
}
async function updateVariety(variety: Variety) {
  try {
    loadingForm.value = true;
    const isUpdated = await varietyService.updateVariety(variety);
    if (!isUpdated) {
      apiErrors.value = [
        { message: "Impossible de modifier la variété", code: "", level: "error" },
      ];
    } else {
      varietyUpdateVisible.value = false;
      varietyToUpdate.value = varietyScript.init();
    }
  } catch (error: any) {
    apiErrors.value = responseService.getApiErrors(error);
  }
  loadingForm.value = false;
}
async function addUserToVariety(variety: Variety) {
  try {
    const isAdd = await varietyService.addUserToVariety(variety);
    if (!isAdd) {
      apiErrors.value = [
        { message: "Impossible d'ajouter la variété", code: "", level: "error" },
      ];
    } else {
      varietyStore.userVarieties.push(variety);
      closeModal();
    }
  } catch (error) {
    apiErrors.value = responseService.getApiErrors(error);
  }
}
async function searchVarieties(searchVariety: SearchVariety) {
  searchedVarieties.value = await varietyService.searchVarieties(searchVariety);
}
async function deleteVariety(variety: Variety) {
  let confirmDialog = defaultConfirmDialogOptions;
  confirmDialog.message =
    "Etes-vous certain de vouloir supprimer la variété " +
    variety.specy.botanicalName +
    " " +
    variety.name +
    " ?";
  confirmDialog.accept = async () => {
    try {
      const isDeleted = await varietyService.deleteVariety(variety.id);
      if (!isDeleted) {
        apiErrors.value = [
          {
            message:
              "Impossible de supprimer la variété " +
              variety.specy.botanicalName +
              " " +
              variety.name,
            code: "",
            level: "error",
          },
        ];
      } else {
        varietyStore.setSelectedVariety(varietyScript.init());
        varietyStore.setUserVarieties(
          varietyStore.userVarieties.filter(
            (varietyIn: Variety) => varietyIn.id !== variety.id
          )
        );
      }
    } catch (error: any) {
      apiErrors.value = responseService.getApiErrors(error);
    }
  };
  confirm.require(confirmDialog);
}
</script>
