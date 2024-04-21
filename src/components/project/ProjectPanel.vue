<template>
  <div v-if="!loading">
    <div
      class="grid col-12"
      v-if="!userStore.user.projectUsers || userStore.user.projectUsers.length === 0"
    >
      <InlineMessage class="col-12 mb-1" severity="info"
        >Commencer par créer un projet</InlineMessage
      >
    </div>
    <div class="col-12">
      <Button
        rounded
        label="Nouveau projet"
        icon="pi pi-plus-circle"
        @click="goToCreateProject()"
      />
      <div
        class="grid col-12 mt-1"
        v-if="userStore.user.projectUsers && userStore.user.projectUsers.length > 0"
      >
        <template
          v-for="projectUser in userStore.user.projectUsers"
          :key="projectUser.id"
        >
          <ProjectUserCard
            :projectUser="projectUser"
            class="col-12 md:col-6 lg:col-4"
            @openUpdateProject="goToUpdateProject"
            @openAddUserToProject="goToAddUserToProject"
            @deleteProject="deleteProject"
            @quitProject="quitProject"
            @selectProjectUser="selectProjectUser"
          />
        </template>
      </div>
    </div>
  </div>
  <LoadingSpinner v-else />
</template>

<script setup lang="ts">
import Button from "primevue/button";
import { ref } from "vue";
import type { Project } from "@/models/Project";
import type { ProjectUser } from "@/models/ProjectUser";
import projectService from "@/services/ProjectService";
import projectUserService from "@/services/ProjectUserService";
import type { ApiError } from "@/models/ApiError";
import responseService from "@/services/ResponseService";
import LoadingSpinner from "@/components/common/LoadingSpinner.vue";
import ProjectUserCard from "@/components/project/ProjectUserCard.vue";
import { useConfirm } from "primevue/useconfirm";
import { defaultConfirmDialogOptions } from "@/scripts/CommonScript";
import InlineMessage from "primevue/inlinemessage";
import { useUserStore } from "@/stores/user";
import userService from "@/services/UserService";
import router from "@/router";
import links from "@/utils/links";

const confirm = useConfirm();
const userStore = useUserStore();

const loading = ref(false);

const apiErrors = ref([] as ApiError[]);

function goToUpdateProject(project: Project) {
  router.push(links.projectUpdate(project));
}

function goToAddUserToProject(project: Project) {
  router.push(links.projectAddUser(project));
}

function goToCreateProject() {
  router.push(links.projectCreate());
}

async function deleteProject(id: number) {
  let confirmDialog = defaultConfirmDialogOptions;
  confirmDialog.message = "Etes-vous certain de vouloir supprimer ce projet ?";
  confirmDialog.accept = async () => {
    try {
      const isDeleted = await projectService.deleteProject(id);
      if (!isDeleted) {
        apiErrors.value = [
          {
            message: "Impossible de supprimer le projet",
            code: "",
            level: "error",
          },
        ];
      } else {
        userStore.user.projectUsers = userStore.user.projectUsers.filter(
          (projectUser: ProjectUser) => projectUser.project.id !== id
        );
      }
    } catch (error: any) {
      apiErrors.value = responseService.getApiErrors(error);
    }
  };
  confirm.require(confirmDialog);
}

async function quitProject(projectUser: ProjectUser) {
  let confirmDialog = defaultConfirmDialogOptions;
  confirmDialog.message = "Etes-vous certain de vouloir quitter ce projet ?";
  confirmDialog.accept = async () => {
    try {
      const isDeleted = await projectUserService.deleteProjectUser(projectUser);
      if (!isDeleted) {
        apiErrors.value = [
          {
            message: "Impossible de quitter ce projet",
            code: "",
            level: "error",
          },
        ];
      } else {
        userStore.user.projectUsers = userStore.user.projectUsers.filter(
          (projectUser: ProjectUser) => projectUser.id !== projectUser.id
        );
      }
    } catch (error: any) {
      apiErrors.value = responseService.getApiErrors(error);
    }
  };
  confirm.require(confirmDialog);
}

async function selectProjectUser(projectUser: ProjectUser) {
  await projectUserService.selectProjectUser(projectUser);
  const user = await userService.getUser();
  userStore.setUser(user);
}
</script>
