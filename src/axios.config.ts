import axios, { type AxiosInstance } from 'axios';
import { useAuthStore } from "@/stores/auth";

axios.defaults.baseURL = import.meta.env.VITE_LIORZH_API_URL

function getAxiosJwtProtected(): AxiosInstance {
    const axiosJwtProtected = axios.create({
        //withCredentials: true, //=> utilisable que si allow-origin différent de *
    });
    // Request interceptors for API calls
    axiosJwtProtected.interceptors.request.use(
      config => {
        config.headers['Authorization'] = useAuthStore().jwt;
            return config;
        },
    );
    return axiosJwtProtected;
}

export const axiosJwtProtected = getAxiosJwtProtected();

