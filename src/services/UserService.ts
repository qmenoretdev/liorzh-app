import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

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
}
const userService = new UserService()
export default userService