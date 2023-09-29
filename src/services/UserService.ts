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
        authStore.setJwt(response.data.token);
        authStore.setAuthenticated(response.status === 200);
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