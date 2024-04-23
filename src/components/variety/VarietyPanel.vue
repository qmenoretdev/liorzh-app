<template>
  <div class="grid">
    <Accordion :multiple="true" :activeIndex="[0]" class="col-12">
      <AccordionTab>
        <template #header>
          <h2 class="p-0 m-0">{{ $t("variety.myVarieties") }}</h2>
        </template>
        <div class="mt-0 mb-2">
          <Button
            label="Nouvelle variété"
            icon="pi pi-plus-circle"
            @click="goToVarietyCreate()"
            style="max-height: 2rem"
          />
        </div>
        <div v-if="!loading">
          <div v-if="varietyStore.userVarieties.length === 0">
            <InlineMessage class="col-12 mb-1" severity="info">
              {{ $t("message.variety.none") }}</InlineMessage
            >
          </div>
          <div v-else>
            <VarietyDataTable
              :data="varietyStore.userVarieties"
              :editable="true"
              @delete="removeVarietyFromProject"
              @update="goToVarietyUpdate"
              @publish="publishVariety"
            />
          </div>
        </div>
        <LoadingSpinner v-else />
      </AccordionTab>
      <AccordionTab>
        <template #header>
          <h2 class="p-0 m-0">{{ $t("variety.publishedVarieties") }}</h2>
        </template>
        <div :class="cssClass.container.default + ' col-12'">
          <SearchVarietyComponent class="col-12 mb-2" @submit="searchVarieties" />
          <VarietyDataTable
            v-if="searchedVarieties.length > 0"
            :data="searchedVarieties"
            :editable="authorizationService.isAdmin()"
            :addable="true"
            @addToProject="addVarietyToProject"
            @delete="deleteVariety"
            @update="goToVarietyUpdate"
          />
          <LoadingSpinner v-else-if="loadingSearchVarieties" />
        </div>
      </AccordionTab>
    </Accordion>
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
import type { ApiError } from "@/models/ApiError";
import varietyScript from "@/scripts/VarietyScript";
import { useConfirm } from "primevue/useconfirm";
import type { Variety } from "@/models/Variety";
import responseService from "@/services/ResponseService";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import InlineMessage from "primevue/inlinemessage";
import type { SearchVariety } from "@/models/request/search/SearchVariety";
import { defaultConfirmDialogOptions } from "@/scripts/CommonScript";
import VarietyDataTable from "@/components/variety/VarietyDataTable.vue";
import toastService from "@/services/ToastService";
import type { ToastMessageOptions } from "primevue/toast";
import { useToast } from "primevue/usetoast";
import authorizationService from "@/services/AuthorizationService";
import projectService from "@/services/ProjectService";
import { useUserStore } from "@/stores/user";
import links from "@/utils/links";
import router from "@/router";

const toast = useToast();

const loading = ref(false);
const loadingSearchVarieties = ref(false);

const apiErrors = ref([] as ApiError[]);
const userStore = useUserStore();
const varietyStore = useVarietyStore();

const confirm = useConfirm();
const searchedVarieties = ref([] as Variety[]);

onMounted(async () => {
  getUserVarieties();
});

function goToVarietyUpdate(variety: Variety) {
  resetForm();
  router.push(links.varietyUpdate(variety));
}
function goToVarietyCreate() {
  resetForm();
  router.push(links.varietyCreate());
}
function resetForm() {
  apiErrors.value = [];
}

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

async function getUserVarieties() {
  loading.value = true;
  try {
    const varieties = await projectService.getVarietiesByProject(
      userStore.activeProjectUser.project
    );
    varietyStore.setUserVarieties(varieties);
    loading.value = false;
  } catch (error: any) {
    const toastOptions = toastService.getToastOptions(
      "Impossible de récupérer vos variétés",
      responseService.getApiErrors(error)
    );
    toastOptions.forEach((toastOption: ToastMessageOptions) => {
      toast.add(toastOption);
    });
  }
}

async function searchVarieties(searchVariety: SearchVariety) {
  loadingSearchVarieties.value = true;
  searchedVarieties.value = [];
  try {
    searchedVarieties.value = await varietyService.searchVarieties(searchVariety);
  } catch (error: any) {
    const toastOptions = toastService.getToastOptions(
      "Erreur lors de la recherche des espèces",
      responseService.getApiErrors(error)
    );
    toastOptions.forEach((toastOption: ToastMessageOptions) => {
      toast.add(toastOption);
    });
  }
  loadingSearchVarieties.value = false;
}
async function removeVarietyFromProject(variety: Variety) {
  let confirmDialog = defaultConfirmDialogOptions;
  confirmDialog.message =
    "Etes-vous certain de vouloir supprimer la variété " +
    variety.specy.botanicalName +
    " " +
    variety.name +
    " ?";
  confirmDialog.accept = async () => {
    try {
      const isDeleted = await projectService.removeVarietyToProject(
        userStore.activeProjectUser.project,
        variety
      );
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
      const toastOptions = toastService.getToastOptions(
        "Impossible de supprimer la variété",
        responseService.getApiErrors(error)
      );
      toastOptions.forEach((toastOption: ToastMessageOptions) => {
        toast.add(toastOption);
      });
    }
  };
  confirm.require(confirmDialog);
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
        searchedVarieties.value = searchedVarieties.value.filter(
          (varietyIn: Variety) => varietyIn.id !== variety.id
        );
      }
    } catch (error: any) {
      const toastOptions = toastService.getToastOptions(
        "Impossible de supprimer la variété",
        responseService.getApiErrors(error)
      );
      toastOptions.forEach((toastOption: ToastMessageOptions) => {
        toast.add(toastOption);
      });
    }
  };
  confirm.require(confirmDialog);
}
async function publishVariety(variety: Variety) {
  let confirmDialog = defaultConfirmDialogOptions;
  confirmDialog.message =
    "Etes-vous certain de vouloir publier la variété " +
    variety.specy.botanicalName +
    " " +
    variety.name +
    " ?";
  confirmDialog.accept = async () => {
    try {
      const publishedVariety = await varietyService.publishVariety(variety.id);
      if (!publishedVariety) {
        apiErrors.value = [
          {
            message:
              "Impossible de publier la variété " +
              variety.specy.botanicalName +
              " " +
              variety.name,
            code: "",
            level: "error",
          },
        ];
      } else {
        varietyStore.userVarieties.forEach((varietyIn: Variety, index: number) => {
          if (varietyIn.id === publishedVariety.id) {
            varietyStore.userVarieties[index] = publishedVariety;
            return;
          }
        });
      }
    } catch (error: any) {
      const toastOptions = toastService.getToastOptions(
        "Impossible de publier la variété",
        responseService.getApiErrors(error)
      );
      toastOptions.forEach((toastOption: ToastMessageOptions) => {
        toast.add(toastOption);
      });
    }
  };
  confirm.require(confirmDialog);
}
</script>
