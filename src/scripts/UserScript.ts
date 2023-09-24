import type { User } from "@/models/User";

class UserScript {
    init(): User {
        return {
            id: 0,
            active: false,
            email: "",
            password: "",
            name: "",
            roles: [],
        }
    }
}
const userScript = new UserScript();
export default userScript;