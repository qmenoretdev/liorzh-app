import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useUserStore } from "@/stores/user";
import userScript from '@/scripts/UserScript'
import projectUserScript from '@/scripts/ProjectUserScript';
import userService from '@/services/UserService';
import type { DecodeJwt } from '@/models/DecodeJwt';

export const useAuthStore = defineStore('authStore', () => {
  const authenticated = ref(localStorage.getItem('authenticated') === 'success');
  const jwt = ref(localStorage.getItem('jwt') || '')
  const refreshToken = ref(localStorage.getItem('refresh_token') || '')
  const jwtExpirationTime = ref(Number(localStorage.getItem('jwt_expiration_time')) || 0)

  function setJwt(token: string) {
    const jwtValue = 'Bearer ' + token;
    localStorage.setItem('jwt', jwtValue);
    jwt.value = jwtValue;
  }
  function setRefreshToken(refreshTokenValue: string) {
    localStorage.setItem('refresh_token', refreshTokenValue);
    refreshToken.value = refreshTokenValue;
  }
  function setDecodeJwt(decodeJwtValue: DecodeJwt) {
    localStorage.setItem('jwt_expiration_time', String(decodeJwtValue.exp));
    jwtExpirationTime.value = decodeJwtValue.exp;
  }
  function setAuthenticated(authenticatedValue: boolean) {
    localStorage.setItem('authenticated', authenticatedValue ? 'success' : 'no-authenticated');
    authenticated.value = authenticatedValue;
  }
  function removeJwt() {
    jwt.value = '';
    refreshToken.value = '';
    jwtExpirationTime.value = 0;
    localStorage.removeItem('jwt');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('jwt_expiration_time');
  }
  function removeAuthenticated() {
    authenticated.value = false;
    localStorage.removeItem('authenticated');
  }
  async function logout() {
    await userService.logout();
    removeAuthenticated();
    removeJwt();
    const userStore = useUserStore();
    userStore.setUser(userScript.init());
    userStore.setActiveProjectUser(projectUserScript.init())
  }
  return { jwt, setJwt, authenticated, logout, setAuthenticated, refreshToken,
    setRefreshToken, jwtExpirationTime, setDecodeJwt, removeJwt }
})
