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
        @click="projectCreationVisible = true"
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
            @openUpdateProject="openUpdateProject"
            @openAddUserToProject="openAddUserToProject"
            @deleteProject="deleteProject"
            @quitProject="quitProject"
            @selectProjectUser="selectProjectUser"
          />
        </template>
      </div>
    </div>
    <ProjectForm
      :visible="projectCreationVisible"
      :apiErrors="apiErrors"
      :loading="loadingForm"
      @submit="createProject"
      @close="closeModal()"
    />
    <ProjectForm
      :visible="projectUpdateVisible"
      :apiErrors="apiErrors"
      :projectToUpdate="selectedProject"
      :header="'Modification d\'une parcelle'"
      :submitButtonLabel="'Modifier'"
      :loading="loadingForm"
      @submit="updateProject"
      @close="closeModal()"
    />
    <ProjectAddUser
      :visible="projectAddUserVisible"
      :apiErrors="apiErrors"
      :project="selectedProject"
      :header="'Ajouter un utilisateur'"
      :submitButtonLabel="'Ajouter'"
      :loading="loadingForm"
      @submit="addUserToProject"
      @close="closeModal()"
    />
  </div>
  <LoadingSpinner v-else />
</template>

<script setup lang="ts">
import Button from "primevue/button";
import ProjectForm from "@/components/project/ProjectForm.vue";
import { ref } from "vue";
import type { Project } from "@/models/Project";
import type { ProjectUser } from "@/models/ProjectUser";
import projectService from "@/services/ProjectService";
import projectUserService from "@/services/ProjectUserService";
import type { ApiError } from "@/models/ApiError";
import responseService from "@/services/ResponseService";
import LoadingSpinner from "@/components/common/LoadingSpinner.vue";
import projectScript from "@/scripts/ProjectScript";
import ProjectUserCard from "@/components/project/ProjectUserCard.vue";
import { useConfirm } from "primevue/useconfirm";
import { defaultConfirmDialogOptions } from "@/scripts/CommonScript";
import InlineMessage from "primevue/inlinemessage";
import { useUserStore } from "@/stores/user";
import userService from "@/services/UserService";
import ProjectAddUser from "@/components/project/ProjectAddUser.vue";
import type { User } from "@/models/User";
import { useToast } from "primevue/usetoast";
import toastService from "@/services/ToastService";
import router from "@/router";

const toast = useToast();
const confirm = useConfirm();
const userStore = useUserStore();
const projectCreationVisible = ref(false);
const projectUpdateVisible = ref(false);
const projectAddUserVisible = ref(false);

const loading = ref(false);
const loadingForm = ref(false);

const apiErrors = ref([] as ApiError[]);

const selectedProject = ref(projectScript.init());

async function createProject(project: Project) {
  try {
    loadingForm.value = true;
    const createdProject = await projectService.createProject(project);
    if (createdProject) {
      projectCreationVisible.value = false;
      const user = await userService.getUser();
      userStore.setUser(user);
      router.push({ name: "workspace" });
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

function openUpdateProject(project: Project) {
  projectUpdateVisible.value = true;
  selectedProject.value = project;
}

function openAddUserToProject(project: Project) {
  projectAddUserVisible.value = true;
  selectedProject.value = project;
}

async function updateProject(project: Project) {
  try {
    loadingForm.value = true;
    const isUpdated = await projectService.updateProject(project);
    if (!isUpdated) {
      apiErrors.value = [
        { message: "Impossible de modifier le projet", code: "", level: "error" },
      ];
    } else {
      projectUpdateVisible.value = false;
    }
  } catch (error: any) {
    apiErrors.value = responseService.getApiErrors(error);
  }
  loadingForm.value = false;
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

function closeModal() {
  projectCreationVisible.value = false;
  projectUpdateVisible.value = false;
  selectedProject.value = projectScript.init();
}

async function selectProjectUser(projectUser: ProjectUser) {
  await projectUserService.selectProjectUser(projectUser);
  const user = await userService.getUser();
  userStore.setUser(user);
}
</script>
