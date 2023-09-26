import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useWorkspaceStore = defineStore('workspace', () => {
  const selectedItemNumber = ref(0);
  function setSelectedItemNumber(itemNumber: number) {
    selectedItemNumber.value = itemNumber;
  }
  return { selectedItemNumber, setSelectedItemNumber }
})
