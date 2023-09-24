import { AxiosError } from "axios";

class ResponseService {
    getErrorMessages(error: any): string[] {
        const messages = [];
        if (error instanceof AxiosError && error.response) {
          if (error.response.data.messages) { // ApiResponse Custom error
            for (const message of error.response.data.messages) {
              messages.push(message);
            }
          } else { // Validator error
            for (const obj of error.response.data) {
              messages.push(obj.message);
            }
          }
        } else {
          // No response from server
          messages.push(error.message);
        }
        return messages;
    }
}
const responseService = new ResponseService();
export default responseService;