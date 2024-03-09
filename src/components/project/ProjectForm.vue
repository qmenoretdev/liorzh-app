<template>
  <div>
    <Dialog
      :header="header"
      v-model:visible="visibleData"
      modal
      :style="{ width: '50vw' }"
      @update:visible="closeModal"
    >
      <div :class="cssClass.container.default">
        <div class="field grid">
          <label for="name" class="col-12 sm:col-3"
            >Nom*&nbsp;
            <div
              class="pi pi-question-circle"
              v-tooltip="
                'Nom du projet. Doit être unique.'
              "
            ></div
          ></label>
          <div class="col-12 sm:col-8">
            <input
              id="name"
              placeholder="Mon super projet"
              type="text"
              :class="getInputClass(formError.nameError)"
              v-model="project.name"
              @keyup.enter="submit()"
            />
          </div>
          <FormMessage :message="formError.nameError" />
        </div>
        <InlineMessage
          class="col-12 mb-1"
          v-for="apiError in apiErrors"
          :key="apiError"
          :severity="apiError.level"
          >{{ apiError.message }}</InlineMessage
        >
        <div class="col-12">
          <Button
            rounded
            :label="submitButtonLabel"
            @click="submit()"
            class="col-4 md:col-3 col-offset-4"
            :loading="loading"
          />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import InlineMessage from "primevue/inlinemessage";
import { ref, watch } from "vue";
import Dialog from "primevue/dialog";
import { cssClass, getInputClass } from "@/utils/style";
import projectScript from "@/scripts/ProjectScript";
import FormMessage from "@/components/common/FormMessage.vue";
import Button from "primevue/button";
import type { ApiError } from "@/models/ApiError";

const project = ref(projectScript.init());
const formError = ref(initFormError());
const visibleData = ref(false);
const props = defineProps({
  visible: {
    default: false,
  },
  header: {
    default: "Nouveau Projet",
  },
  projectToUpdate: {
    default: projectScript.init(),
  },
  apiErrors: {
    default: [] as ApiError[],
  },
  submitButtonLabel: {
    default: "Créer",
  },
  loading: {
    default: false,
  },
});
const emit = defineEmits(["close", "submit"]);
watch(
  () => props.visible,
  (newValue) => {
    visibleData.value = newValue;
  }
);
watch(
  () => props.projectToUpdate,
  (newValue) => {
    project.value = newValue;
  }
);
function closeModal() {
  emit("close");
}
function submit() {
  if (checkForm()) {
    emit("submit", project.value);
  }
}
function checkForm() {
  formError.value = initFormError();
  let checkOk = true;
  if (project.value.name === "" || project.value.name == undefined) {
    formError.value.nameError = "Le nom est obligatoire";
    checkOk = false;
  }
  return checkOk;
}
function initFormError() {
  return {
    nameError: "",
  };
}
</script>
