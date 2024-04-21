<template>
  <div class="grid">
    <Accordion :multiple="true" :activeIndex="[0]" class="col-12">
      <AccordionTab>
        <template #header>
          <h2 class="p-0 m-0">{{ $t("sowing.title") }}</h2>
        </template>
        <div class="mt-0 mb-2">
          <Button
            :label="$t('button.addSowing')"
            icon="pi pi-plus-circle"
            @click="goToSowingCreation"
            style="max-height: 2rem"
          />
        </div>
        <div v-if="!loading">
          <div v-if="sowingStore.userSowings.length === 0">
            <InlineMessage class="col-12 mb-1" severity="info">{{
              $t("message.sowing.none")
            }}</InlineMessage>
          </div>
          <div v-else>
            <SowingDataTable
              :sowings="sowingStore.userSowings"
              :editable="true"
              @delete="deleteSowing"
              @update="goToSowingUpdate"
            />
          </div>
        </div>
        <LoadingSpinner v-else />
      </AccordionTab>
    </Accordion>
  </div>
</template>

<script setup lang="ts">
import sowingService from "@/services/SowingService";
import { useSowingStore } from "@/stores/sowing";
import { onMounted, ref } from "vue";
import LoadingSpinner from "@/components/common/LoadingSpinner.vue";
import Button from "primevue/button";
import type { ApiError } from "@/models/ApiError";
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
import { useUserStore } from "@/stores/user";
import projectService from "@/services/ProjectService";
import router from "@/router";
import links from "@/utils/links";
const { t } = useI18n();

const toast = useToast();

const loading = ref(false);

const apiErrors = ref([] as ApiError[]);
const userStore = useUserStore();
const sowingStore = useSowingStore();

const confirm = useConfirm();

onMounted(async () => {
  getProjectSowings();
});

function goToSowingUpdate(sowing: Sowing) {
  resetForm();
  router.push(links.sowingUpdate(sowing));
}
function goToSowingCreation() {
  resetForm();
  router.push(links.sowingCreate());
}
function resetForm() {
  apiErrors.value = [];
}

async function getProjectSowings() {
  loading.value = true;
  try {
    const sowings = await projectService.getSowingsByProject(
      userStore.activeProjectUser.project
    );
    sowingStore.setUserSowings(sowings);
    loading.value = false;
  } catch (error: any) {
    const toastOptions = toastService.getToastOptions(
      t("message.sowing.getError"),
      responseService.getApiErrors(error)
    );
    toastOptions.forEach((toastOption: ToastMessageOptions) => {
      toast.add(toastOption);
    });
  }
}

async function deleteSowing(sowing: Sowing) {
  let confirmDialog = defaultConfirmDialogOptions;
  confirmDialog.message =
    "Etes-vous certain de vouloir supprimer le semis du " +
    sowing.sowingDate +
    " de la variété " +
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
              "Impossible de supprimer le semis du " +
              sowing.sowingDate +
              " de la variété " +
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
      const toastOptions = toastService.getToastOptions(
        t("message.sowing.deleteError"),
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
