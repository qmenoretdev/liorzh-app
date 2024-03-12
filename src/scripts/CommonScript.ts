import { useUserStore } from "@/stores/user";
import { PUBLIC } from "@/utils/constant";
import type { ConfirmationOptions } from "primevue/confirmationoptions";

export const defaultConfirmDialogOptions = {
  message: "Etes-vous certain de vouloir réaliser cette action ?",
  header: "Confirmation",
  icon: "pi pi-exclamation-triangle",
  rejectLabel: 'Non',
  acceptLabel: 'Oui',
  acceptClass: 'p-button-danger',
} as ConfirmationOptions;

export function getOwner(isPublic: boolean) {
  if (isPublic) {
    return PUBLIC;
  }
  const userStore = useUserStore();
  return userStore.activeProjectUser.project.name;
}