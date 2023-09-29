import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/models/User'
import userScript from '@/scripts/UserScript'

export const useUserStore = defineStore('userStore', () => {
  const user = ref(userScript.init());
  function setUser(newUser: User) {
    user.value = newUser;
  }
  return { user, setUser }
})
