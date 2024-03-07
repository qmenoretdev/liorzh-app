import { axiosJwtProtected } from '@/axios.config';
import type { ProjectUser } from "@/models/ProjectUser";

class ProjectUserService {
    async selectProjectUser(projectUser: ProjectUser) {
        const response = await axiosJwtProtected.put(`projectusers/${projectUser.id}/select`);
        return response.status === 200;
    }
    async deleteProjectUser(projectUser: ProjectUser): Promise<boolean> {
        const response = await axiosJwtProtected.delete(`projectusers/${projectUser.id}`);
        return response.status === 204;
    }
}
const projectUserService = new ProjectUserService();
export default projectUserService;