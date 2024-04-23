<template>
  <ProjectForm
    v-show="!loading"
    :header="'Modification d\'un projet'"
    :projectToUpdate="selectedProject"
    :apiErrors="apiErrors"
    :loading="loadingForm"
    :submitButtonLabel="$t('button.update')"
    @submit="updateProject"
    @quit="quit()"
  />
  <LoadingSpinner v-if="loading" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import projectService from "@/services/ProjectService";
import type { ApiError } from "@/models/ApiError";
import responseService from "@/services/ResponseService";
import ProjectForm from "@/components/project/ProjectForm.vue";
import type { Project } from "@/models/Project";
import projectScript from "@/scripts/ProjectScript";
import router from "@/router";
import LoadingSpinner from "@/components/common/LoadingSpinner.vue";
import { onMounted } from "vue";
import userService from "@/services/UserService";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();

const apiErrors = ref([] as ApiError[]);
const loadingForm = ref(false);
const selectedProject = ref(projectScript.init());
const loading = ref(true);
const props = defineProps({
  id: {
    default: 0,
  },
});

onMounted(async () => {
  selectedProject.value = await projectService.getProject(props.id);
  loading.value = false;
});

async function updateProject(project: Project) {
  try {
    loadingForm.value = true;
    const isUpdated = await projectService.updateProject(project);
    if (!isUpdated) {
      apiErrors.value = [
        { message: "Impossible de modifier le projet", code: "", level: "error" },
      ];
    } else {
      const user = await userService.getUser();
      userStore.setUser(user);
      quit();
    }
  } catch (error: any) {
    apiErrors.value = responseService.getApiErrors(error);
  }
  loadingForm.value = false;
}

function quit() {
  router.go(-1);
}
</script>
