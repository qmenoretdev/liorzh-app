import type { ProjectUser } from "@/models/ProjectUser";
import projectScript from '@/scripts/ProjectScript'

class ProjectUserScript {
    init(): ProjectUser {
        return {
            id: 0,
            project: projectScript.init(),
            roles: [],
            active: false,
        }
    }
}
const projectUserScript = new ProjectUserScript();
export default projectUserScript;