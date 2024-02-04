<template>
  <div class="grid">
    <Accordion :multiple="true" :activeIndex="[0]" class="col-12">
      <AccordionTab>
        <template #header>
          <h2 class="p-0 m-0">{{ $t('sowing.title') }}</h2>
        </template>
        <div class="mt-0 mb-2">
          <Button
            :label="$t('button.addSowing')"
            icon="pi pi-plus-circle"
            @click="openCreationForm()"
            style="max-height: 2rem"
          />
        </div>
        <div v-if="!loading">
          <div v-if="sowingStore.userSowings.length === 0">
            <InlineMessage class="col-12 mb-1" severity="info"
              >{{ $t('message.sowing.none') }}</InlineMessage
            >
          </div>
          <div v-else>
            <SowingDataTable
              :sowings="sowingStore.userSowings"
              :editable="true"
              @delete="deleteSowing"
              @update="openUpdateForm"
            />
          </div>
        </div>
        <LoadingSpinner v-else />
      </AccordionTab>
    </Accordion>
    <SowingForm
      :header="$t('sowing.createTitle')"
      :proposedSowing="proposedSowing"
      :visible="sowingCreationVisible"
      :apiErrors="apiErrors"
      :loading="loadingForm"
      @submit="createSowing"
      @close="closeModal()"
    />
    <SowingForm
      :header="$t('sowing.updateTitle')"
      :sowingToUpdate="sowingToUpdate"
      :visible="sowingUpdateVisible"
      :apiErrors="apiErrors"
      :loading="loadingForm"
      :submitButtonLabel="'Modifier'"
      @submit="updateSowing"
      @close="closeModal()"
    />
  </div>
</template>

<script setup lang="ts">
import sowingService from "@/services/SowingService";
import { useSowingStore } from "@/stores/sowing";
import { onMounted, ref } from "vue";
import LoadingSpinner from "@/components/common/LoadingSpinner.vue";
import Button from "primevue/button";
import SowingForm from "@/components/sowing/SowingForm.vue";
import type { ApiError } from "@/models/ApiError";
import sowingScript from "@/scripts/SowingScript";
import { useConfirm } from "primevue/useconfirm";
import type { Sowing } from "@/models/Sowing";
import responseService from "@/services/ResponseService";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import InlineMessage from "primevue/inlinemessage";
import { defaultConfirmDialogOptions } from "@/scripts/CommonScript";
import SowingDataTable from "@/components/sowing/SowingDataTable.vue";
import toastService from "@/services/ToastService";
import type { ToastMessageOptions } from "primevue/toast";
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const toast = useToast();

const loading = ref(false);
const loadingForm = ref(false);

const apiErrors = ref([] as ApiError[]);
const sowingStore = useSowingStore();
const sowingCreationVisible = ref(false);
const sowingUpdateVisible = ref(false);
// Variété proposée si l'utilisateur souhaite créé une variété du même ID
const proposedSowing = ref(sowingScript.init() as Sowing);
// Variété passé en prop pour mise à jour
const sowingToUpdate = ref(sowingScript.init() as Sowing);

const confirm = useConfirm();

onMounted(async () => {
  getUserSowings();
});

function closeModal() {
  sowingCreationVisible.value = false;
  sowingUpdateVisible.value = false;
}

function openUpdateForm(sowing: Sowing) {
  sowingToUpdate.value = sowing;
  sowingUpdateVisible.value = true;
  resetForm();
}
function openCreationForm() {
  sowingToUpdate.value = sowingScript.init();
  sowingCreationVisible.value = true;
  resetForm();
}
function resetForm() {
  apiErrors.value = [];
  proposedSowing.value = sowingScript.init();
}

async function getUserSowings() {
  loading.value = true;
  try {
  const sowings = await sowingService.getSowingsByCurrentUser();
  sowingStore.setUserSowings(sowings);
  loading.value = false;
  } catch(error: any) {
    const toastOptions = toastService.getToastOptions(t('message.sowing.getError'), responseService.getApiErrors(error))
      toastOptions.forEach((toastOption: ToastMessageOptions) => {
      toast.add(toastOption);
    });
  }
}
async function createSowing(sowing: Sowing) {
  loadingForm.value = true;
  try {
    const createdSowing = await sowingService.createSowing(sowing);
    if (createdSowing) {
      sowingStore.userSowings.push(createdSowing);
      closeModal();
    } else {
      apiErrors.value = [
        { message: t('message.sowing.createError'), code: "", level: "error" },
      ];
    }
  } catch (error: any) {
    apiErrors.value = responseService.getApiErrors(error);
  }
  loadingForm.value = false;
}
async function updateSowing(sowing: Sowing) {
  try {
    loadingForm.value = true;
    const isUpdated = await sowingService.updateSowing(sowing);
    if (!isUpdated) {
      apiErrors.value = [
        { message: t('message.sowing.updateError'), code: "", level: "error" },
      ];
    } else {
      sowingUpdateVisible.value = false;
      sowingToUpdate.value = sowingScript.init();
      sowingStore.userSowings.forEach((sowingIn: Sowing) => {
        if (sowing.id === sowingIn.id) {
          sowingIn = sowing
        }
      });
    }
  } catch (error: any) {
    apiErrors.value = responseService.getApiErrors(error);
  }
  loadingForm.value = false;
}
async function deleteSowing(sowing: Sowing) {
  let confirmDialog = defaultConfirmDialogOptions;
  confirmDialog.message =
    "Etes-vous certain de vouloir supprimer le semis du " + sowing.sowingDate + " de la variété " +
    sowing.variety.specy.botanicalName +
    " " +
    sowing.variety.name +
    " ?";
  confirmDialog.accept = async () => {
    try {
      const isDeleted = await sowingService.deleteSowing(sowing.id);
      if (!isDeleted) {
        apiErrors.value = [
          {
            message:
              "Impossible de supprimer le semis du " + sowing.sowingDate + " de la variété " +
              sowing.variety.specy.botanicalName +
              " " +
              sowing.variety.name,
            code: "",
            level: "error",
          },
        ];
      } else {
        sowingStore.userSowings = sowingStore.userSowings.filter(
            (sowingIn: Sowing) => sowingIn.id !== sowing.id
        );
      }
    } catch (error: any) {
      const toastOptions = toastService.getToastOptions(t('message.sowing.deleteError'), responseService.getApiErrors(error))
        toastOptions.forEach((toastOption: ToastMessageOptions) => {
        toast.add(toastOption);
      });
    }
  };
  confirm.require(confirmDialog);
}
</script>
