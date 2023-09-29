import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useWorkspaceStore = defineStore('workspaceStore', () => {
  const selectedItemNumber = ref(0);
  function setSelectedItemNumber(itemNumber: number) {
    selectedItemNumber.value = itemNumber;
  }
  return { selectedItemNumber, setSelectedItemNumber }
})
