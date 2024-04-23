<template>
  <div>
    <div :class="getCardClass()" style="height: 100%" @click="selectProjectUser">
      <div class="grid p-2">
        <div class="col-6" style="text-align: center">
          <h2>
            {{ projectUser.project.name }}
          </h2>
        </div>
        <div class="col-6">
          <Button
            v-if="projectUser.roles.includes(PROJECT_ROLES.OWNER)"
            icon="pi pi-file-edit"
            class="m-1"
            raised
            rounded
            title="Modifier le projet"
            @click.stop="openUpdateProject()"
          />
          <Button
            v-if="projectUser.roles.includes(PROJECT_ROLES.OWNER)"
            icon="pi pi-plus-circle"
            class="m-1"
            raised
            rounded
            title="Ajouter un utilisateur au projet"
            @click.stop="openAddUserToProject()"
          />
          <Button
            icon="pi pi-minus-circle"
            class="m-1"
            raised
            rounded
            severity="danger"
            title="Quitter le projet"
            @click.stop="quitProject()"
          />
          <Button
            v-if="projectUser.roles.includes(PROJECT_ROLES.OWNER)"
            class="m-1"
            icon="pi pi-trash"
            raised
            rounded
            severity="danger"
            title="Supprimer le projet"
            @click.stop="deleteProject()"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import projectUserScript from "@/scripts/ProjectUserScript";
import { PROJECT_ROLES } from "@/utils/constant";
import Button from "primevue/button";

const emit = defineEmits([
  "openUpdateProject",
  "openAddUserToProject",
  "deleteProject",
  "selectProjectUser",
  "quitProject",
]);
const props = defineProps({
  projectUser: {
    default: projectUserScript.init(),
  },
});
const cardClassBase = "selectable-card container p-1 cursor-pointer";
function getCardClass() {
  let cardClass = cardClassBase;
  if (props.projectUser.active) {
    return cardClass + " selected-card";
  }
  return cardClass;
}
function openUpdateProject() {
  emit("openUpdateProject", props.projectUser.project);
}
function openAddUserToProject() {
  emit("openAddUserToProject", props.projectUser.project);
}
function deleteProject() {
  emit("deleteProject", props.projectUser.project.id);
}
function selectProjectUser() {
  emit("selectProjectUser", props.projectUser);
}
function quitProject() {
  emit("quitProject", props.projectUser);
}
</script>
