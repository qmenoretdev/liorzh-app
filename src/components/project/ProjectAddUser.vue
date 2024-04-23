<template>
  <div class="grid">
    <div :class="cssClass.container.default">
      <div class="field grid">
        <label for="email" class="col-12 sm:col-3"
          >Email de l'utilisateur à ajouter au projet*</label
        >
        <div class="col-12 sm:col-8">
          <input
            id="email"
            placeholder="monsupercopain@mail.com"
            type="text"
            :class="getInputClass(formError.emailError)"
            v-model="user.email"
            @keyup.enter="submit()"
          />
        </div>
        <FormMessage :message="formError.emailError" />
      </div>
      <div class="field grid">
        <label for="role" class="col-12 sm:col-3">Niveau de permission</label>
        <div class="col-12 sm:col-4">
          <select id="role" v-model="role" :class="cssClass.input.default">
            <option v-for="roleIn in PROJECT_ROLES" :key="roleIn" :value="roleIn">
              {{ getRoleLabel(roleIn) }}
            </option>
          </select>
        </div>
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
          :loading="loadingForm"
        />
        <Button
          rounded
          :label="$t('button.cancel')"
          @click="router.go(-1)"
          class="col-5 md:col-4"
          severity="secondary"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InlineMessage from "primevue/inlinemessage";
import { onMounted, ref } from "vue";
import { cssClass, getInputClass } from "@/utils/style";
import projectScript from "@/scripts/ProjectScript";
import FormMessage from "@/components/common/FormMessage.vue";
import Button from "primevue/button";
import type { ApiError } from "@/models/ApiError";
import userScript from "@/scripts/UserScript";
import { PROJECT_ROLES } from "@/utils/constant";
import projectService from "@/services/ProjectService";
import router from "@/router";
import type { User } from "@/models/User";
import type { Project } from "@/models/Project";
import responseService from "@/services/ResponseService";
import { useToast } from "primevue/usetoast";
import toastService from "@/services/ToastService";

const toast = useToast();
const user = ref(userScript.init());
const project = ref(projectScript.init());
const role = ref(PROJECT_ROLES.READER);
const loading = ref(true);
const loadingForm = ref(false);
const apiErrors = ref([] as ApiError[]);

const formError = ref(initFormError());

const props = defineProps({
  header: {
    default: "Ajouter un utilisateur",
  },
  submitButtonLabel: {
    default: "Ajouter",
  },
  id: {
    default: 0,
  },
});

onMounted(async () => {
  project.value = await projectService.getProject(props.id);
  loading.value = false;
});

function submit() {
  if (checkForm()) {
    addUserToProject(project.value, user.value, getRoles(role.value));
  }
}
async function addUserToProject(project: Project, user: User, roles: string[]) {
  try {
    loadingForm.value = true;
    const isAdded = await projectService.addUserToProject(project, user, roles);
    if (!isAdded) {
      apiErrors.value = [
        { message: "Impossible d'ajouter l'utilisateur'", code: "", level: "error" },
      ];
    } else {
      toast.add(toastService.showSuccess("Utilisateur ajouté !", ""));
    }
  } catch (error: any) {
    apiErrors.value = responseService.getApiErrors(error);
  }
  loadingForm.value = false;
}
function getRoles(role: string): string[] {
  switch (role) {
    case PROJECT_ROLES.MODIFIER:
      return [PROJECT_ROLES.READER, PROJECT_ROLES.MODIFIER];
    case PROJECT_ROLES.OWNER:
      return [PROJECT_ROLES.READER, PROJECT_ROLES.MODIFIER, PROJECT_ROLES.OWNER];
    default:
      return [PROJECT_ROLES.READER];
  }
}
function getRoleLabel(role: string): string {
  switch (role) {
    case PROJECT_ROLES.MODIFIER:
      return "Edition";
    case PROJECT_ROLES.OWNER:
      return "Propriétaire";
    default:
      return "Lecture";
  }
}
function checkForm() {
  formError.value = initFormError();
  let checkOk = true;
  if (user.value.email === "" || user.value.email == undefined) {
    formError.value.emailError = "Email obligatoire";
    checkOk = false;
  }
  return checkOk;
}
function initFormError() {
  return {
    emailError: "",
  };
}
</script>
