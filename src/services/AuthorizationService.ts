import { useUserStore } from "@/stores/user";
import { ROLES } from "@/utils/constant";

class AuthorizationService {
    isAdmin(): boolean {
        const userStore = useUserStore();
        return userStore.user !== undefined && userStore.user.roles !== undefined && userStore.user.roles.includes(ROLES.ADMIN);
    }
}

const authorizationService = new AuthorizationService();
export default authorizationService;