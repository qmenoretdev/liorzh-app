import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Workspace } from '@/models/Workspace';
import workspaceScript from '@/scripts/WorkspaceScript';

export const useWorkspaceStore = defineStore('workspaceStore', () => {
  const workspace = ref(workspaceScript.init());
  const selectedItemNumber = ref(0);
  function setSelectedItemNumber(itemNumber: number) {
    selectedItemNumber.value = itemNumber;
  }
  function setWorkspace(workspaceValue: Workspace) {
    workspace.value = workspaceValue;
  }
  return { selectedItemNumber, setSelectedItemNumber, workspace, setWorkspace }
})
