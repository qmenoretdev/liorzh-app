<template>
  <div class="grid">
    <div :class="cssClass.container.default + ' col-12 md:col-6'">
      <div class="mt-0 mb-2">
        <h2 class="mt-1 mb-2">Mes Variétés</h2>
        <Button
          rounded
          class="button-create"
          label="Nouvelle variété"
          icon="pi pi-plus-circle"
          @click="varietyCreationVisible = true"
          style="max-height: 2rem"
        />
      </div>
      <div v-if="!loading">
        <div v-if="varietyStore.userVarieties.length === 0">
          Vous n'avez pas encore de variétés. Vous pouvez rechercher dans le panel de
          droite les variétés existantes. Sinon vous pouvez en ajouter une.
        </div>
        <div v-else>
          <DataTable
            v-model:selection="varietyStore.selectedVariety"
            :value="varietyStore.userVarieties"
            scrollable
            scrollHeight="480px"
            selectionMode="single"
            :metaKeySelection="false"
            dataKey="id"
          >
            <ColumnGroup type="header">
              <Row>
                <Column header="Espèce" :colspan="2"></Column>
                <Column header="Variété" :rowspan="2"></Column>
              </Row>
              <Row>
                <Column header="Nom botanique"></Column>
                <Column header="Nom(s) commun(s)"></Column>
              </Row>
            </ColumnGroup>
            <Column field="specy.botanicalName"></Column>
            <Column field="specy.frenchCommonNames">
              <template #body="slotProps">
                {{
                  specyService.commonNamesArrayToString(
                    slotProps.data.specy.frenchCommonNames
                  )
                }}
              </template>
            </Column>
            <Column field="name"></Column>
          </DataTable>
        </div>
      </div>
      <LoadingSpinner v-else />
    </div>
    <div :class="cssClass.container.default + ' col-12 md:col-6'">
      <h2 class="public-object-text mt-1 mb-2">Variétés publiées</h2>
      <SearchVariety />
    </div>
    <div
      :class="cssClass.container.default + ' col-12 md:col-6'"
      v-if="varietyStore.selectedVariety && varietyStore.selectedVariety.id !== 0"
    >
      <VarietyDetails :variety="varietyStore.selectedVariety" />
    </div>
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
      :specyToUpdate="selectedVariety"
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
import SearchVariety from "@/components/variety/SearchVariety.vue";
import VarietyForm from "@/components/variety/VarietyForm.vue";
import type { ApiError } from "@/models/ApiError";
import varietyScript from "@/scripts/VarietyScript";
import { useConfirm } from "primevue/useconfirm";
import type { Variety } from "@/models/Variety";
import responseService from "@/services/ResponseService";
import specyService from "@/services/SpecyService";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup";
import Row from "primevue/row";
import VarietyDetails from "./VarietyDetails.vue";

const loading = ref(false);
const apiErrors = ref([] as ApiError[]);
const loadingForm = ref(false);
const varietyStore = useVarietyStore();
const varietyCreationVisible = ref(false);
const varietyUpdateVisible = ref(false);
const proposedVariety = ref(varietyScript.init() as Variety);

const confirm = useConfirm();
const selectedVariety = ref(varietyScript.init());

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
</script>
