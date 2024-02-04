import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Sowing } from '@/models/Sowing';

export const useSowingStore = defineStore('sowingStore', () => {
  const userSowings = ref([] as Sowing[]);
  function setUserSowings(sowingsValue: Sowing[]) {
    userSowings.value = sowingsValue;
  }
  return { userSowings, setUserSowings }
})
