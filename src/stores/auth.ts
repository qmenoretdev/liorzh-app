import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useUserStore } from "@/stores/user";
import userScript from '@/scripts/UserScript'

export const useAuthStore = defineStore('authStore', () => {
  const authenticated = ref(localStorage.getItem('authenticated') === 'success');
  const jwt = ref(localStorage.getItem('jwt') || '')
  function setJwt(token: string) {
    const jwtValue = 'Bearer ' + token;
    localStorage.setItem('jwt', jwtValue);
    jwt.value = jwtValue;
  }
  function setAuthenticated(authenticatedValue: boolean) {
    localStorage.setItem('authenticated', authenticatedValue ? 'success' : 'no-authenticated');
    authenticated.value = authenticatedValue;
  }
  function removeJwt() {
    jwt.value = '';
    localStorage.removeItem('jwt');
  }
  function removeAuthenticated() {
    authenticated.value = false;
    localStorage.removeItem('authenticated');
  }
  function logout() {
    removeAuthenticated();
    removeJwt();
    const userStore = useUserStore();
    userStore.user = userScript.init();
  }
  return { jwt, setJwt, authenticated, logout, setAuthenticated }
})
