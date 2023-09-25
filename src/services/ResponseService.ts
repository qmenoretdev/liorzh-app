import { AxiosError } from "axios";
import type { ApiError } from "@/models/ApiError";

class ResponseService {
    getApiErrors(error: any): ApiError[] {
        const apiErrors = [] as ApiError[];
        if (error instanceof AxiosError && error.response) {
          if (error.response.data) { // ApiError[] Custom error
            return error.response.data;
          }
        } else {
          // No response from server
          apiErrors.push({
            messages: [error.message]
          } as ApiError);
        }
        return apiErrors;
    }
}
const responseService = new ResponseService();
export default responseService;