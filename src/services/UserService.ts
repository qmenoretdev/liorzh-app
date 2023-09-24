import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import type { User } from "@/models/User";
class UserService {
  async login(username: string, password: string): Promise<boolean> {
    const authStore = useAuthStore();
    return axios
      .post(import.meta.env.VITE_LIORZH_API_URL + '/login_check', {
        username: username,
        password: password,                
      })
      .then((response) => {
        authStore.setJwt(response.data.token);
        return response.status === 200
      })
  }
  async register(user: User): Promise<User> {
    const response = await axios.post(import.meta.env.VITE_LIORZH_API_URL + '/create/user', 
      {
        name: user.name,
        email: user.email,
        password: user.password,
        active: false,
      });
    return response.data;
  }
}
const userService = new UserService()
export default userService