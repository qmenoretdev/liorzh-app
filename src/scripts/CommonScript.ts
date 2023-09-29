import type { ConfirmationOptions } from "primevue/confirmationoptions";

export const defaultConfirmDialogOptions = {
  message: "Etes-vous certain de vouloir réaliser cette action ?",
  header: "Confirmation",
  icon: "pi pi-exclamation-triangle",
  rejectLabel: 'Non',
  acceptLabel: 'Oui',
  acceptClass: 'p-button-danger',
} as ConfirmationOptions;