<template>
  <div class="grid">
    <div :class="cssClass.container.default">
      <div class="field grid">
        <label for="name" class="col-12 sm:col-3"
          >Nom*&nbsp;
          <div
            class="pi pi-question-circle"
            v-tooltip="'Nom du projet. Doit être unique.'"
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
          class="col-5 md:col-4 mr-2"
          :loading="loading"
        />
        <Button
          rounded
          :label="$t('button.cancel')"
          @click="emits('quit')"
          class="col-5 md:col-4"
          severity="secondary"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InlineMessage from "primevue/inlinemessage";
import { ref, watch } from "vue";
import { cssClass, getInputClass } from "@/utils/style";
import projectScript from "@/scripts/ProjectScript";
import FormMessage from "@/components/common/FormMessage.vue";
import Button from "primevue/button";
import type { ApiError } from "@/models/ApiError";

const project = ref(projectScript.init());
const formError = ref(initFormError());

const props = defineProps({
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
const emits = defineEmits(["quit", "submit"]);

watch(
  () => props.projectToUpdate,
  (newValue) => {
    project.value = newValue;
  }
);
function submit() {
  if (checkForm()) {
    emits("submit", project.value);
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
