import axios, { type AxiosInstance } from 'axios';
import { useAuthStore } from "@/stores/auth";
import userService from './services/UserService';

axios.defaults.baseURL = import.meta.env.VITE_LIORZH_API_URL

function getAxiosJwtProtected(): AxiosInstance {
    const axiosJwtProtected = axios.create({
        //withCredentials: true, //=> utilisable que si allow-origin différent de *
    });
    // Request interceptors for API calls
    axiosJwtProtected.interceptors.request.use(
      async config => {
        if (useAuthStore().jwtExpirationTime !== 0) {
            if (useAuthStore().jwtExpirationTime * 1000 - Date.now() <= 0) {
                await userService.refreshToken();
            }
        }
        config.headers['Authorization'] = useAuthStore().jwt;
        return config;
      },
    );
    return axiosJwtProtected;
}

export const axiosJwtProtected = getAxiosJwtProtected();