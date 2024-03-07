import type { Project } from "@/models/Project";

class ProjectScript {
    init(): Project {
        return {
            id: 0,
            name: '',
        }
    }
}
const projectScript = new ProjectScript();
export default projectScript;