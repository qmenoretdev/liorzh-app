import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const jwt = ref('')
  function setJwt(token: string) {
    jwt.value = 'Bearer ' + token;
  }

  return { jwt, setJwt }
})
