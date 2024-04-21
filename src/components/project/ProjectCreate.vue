<template>
  <ProjectForm
    :header="'Création d\'un projet'"
    :apiErrors="apiErrors"
    :loading="loadingForm"
    :submitButtonLabel="$t('button.create')"
    @submit="createProject"
    @quit="quit()"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import projectService from "@/services/ProjectService";
import type { ApiError } from "@/models/ApiError";
import responseService from "@/services/ResponseService";
import ProjectForm from "@/components/project/ProjectForm.vue";
import type { Project } from "@/models/Project";
import router from "@/router";
import userService from "@/services/UserService";
import { useUserStore } from "@/stores/user";
import links from "@/utils/links";
import projectUserService from "@/services/ProjectUserService";

const userStore = useUserStore();
const apiErrors = ref([] as ApiError[]);
const loadingForm = ref(false);

async function createProject(project: Project) {
  try {
    loadingForm.value = true;
    const createdProject = await projectService.createProject(project);
    if (createdProject) {
      selectProjectUser(createdProject);
      router.push(links.workspace());
    } else {
      apiErrors.value = [
        { message: "Impossible de créer le projet", code: "", level: "error" },
      ];
    }
  } catch (error: any) {
    apiErrors.value = responseService.getApiErrors(error);
  }
  loadingForm.value = false;
}

async function selectProjectUser(project: Project) {
  const user = await userService.getUser();
  const projectUser = user.projectUsers.find((projectUserIn) => {
    console.log(projectUserIn);
    return project.id === projectUserIn.project.id;
  });
  if (projectUser) {
    await projectUserService.selectProjectUser(projectUser);
    const user = await userService.getUser();
    userStore.setUser(user);
  }
}

function quit() {
  router.go(-1);
}
</script>
