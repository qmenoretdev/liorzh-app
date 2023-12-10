
import type { ApiError } from "@/models/ApiError";
import type { ToastMessageOptions } from "primevue/toast";

const life = 5000;

class ToastService { 

    showSuccess(summary: string, detail: string): ToastMessageOptions {
        return { severity: 'success', summary: summary, detail: detail, life: life };
    };

    showInfo(summary: string, detail: string): ToastMessageOptions {
        return { severity: 'info', summary: summary, detail: detail, life: life };
    };

    showWarn(summary: string, detail: string): ToastMessageOptions {
        return { severity: 'warn', summary: summary, detail: detail, life: life };
    };

    showError (summary: string, detail: string): ToastMessageOptions {
        return { severity: 'error', summary: summary, detail: detail, life: life };
    };
    
    getToastOptions(summary: string, apiErrors: ApiError[]): ToastMessageOptions[] {
        const toastMessageOptions = [] as ToastMessageOptions[];
        apiErrors.forEach((apiError: ApiError) => {
            switch (apiError.level) {
                case 'info':
                    toastMessageOptions.push(this.showInfo(summary, apiError.message));
                    break;
                case 'warn':
                    toastMessageOptions.push(this.showWarn(summary, apiError.message));
                    break;
                case 'error':
                    toastMessageOptions.push(this.showError(summary, apiError.message));
                    break;
                default:
                    toastMessageOptions.push(this.showError(summary, apiError.message));
                    break;
            }
        });
        return toastMessageOptions;
    }
}
const toastService = new ToastService();
export default toastService;