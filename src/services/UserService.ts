import axios from 'axios';
import { axiosJwtProtected } from '@/axios.config';
import { useAuthStore } from '@/stores/auth';
import type { User } from "@/models/User";
class UserService {
  
  async login(username: string, password: string): Promise<void> {
    const authStore = useAuthStore();
    return axios
      .post('login_check', {
        username: username,
        password: password,                
      })
      .then((response) => {
        authStore.removeJwt();
        authStore.setJwt(response.data.token);
        authStore.setRefreshToken(response.data.refresh_token);
        authStore.setAuthenticated(response.status === 200);
        this.decodeJwt()
      })
  }
  async decodeJwt(): Promise<void> {
    const authStore = useAuthStore();
    return axiosJwtProtected
      .get('decode-jwt')
      .then((response) => {
        authStore.setDecodeJwt(response.data)
      })
  }
  async refreshToken(): Promise<void> {
    const authStore = useAuthStore();
    return axios
      .post('token/refresh', {
        refresh_token: authStore.refreshToken
      })
      .then((response) => {
        authStore.setJwt(response.data.token);
        authStore.setAuthenticated(response.status === 200);
      })
  }
  async logout() {
    const authStore = useAuthStore();
    return axios.post('token/invalidate', {
      refresh_token: authStore.refreshToken
    })
  }
  async register(user: User): Promise<User> {
    const response = await axios.post('create/user', 
      {
        name: user.name,
        email: user.email,
        password: user.password,
        active: false,
      } as User);
    return response.data;
  }
  async getUser(): Promise<User> {
    const response = await axiosJwtProtected.get('users');
    return response.data;
  }
}
const userService = new UserService()
export default userService