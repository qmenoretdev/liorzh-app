import type { Plot } from "@/models/Plot";
import { axiosJwtProtected } from '@/axios.config';
import type { Project } from "@/models/Project";
import type { Variety } from "@/models/Variety";
import type { Sowing } from "@/models/Sowing";
import { queryParams } from "@/utils/queryParams";
import type { User } from "@/models/User";
import type { ProjectUser } from "@/models/ProjectUser";

class ProjectService {
    async createProject(project: Project): Promise<Project> {
        const response = await axiosJwtProtected.post('projects', {
            name: project.name,
        } as Project);
        return response.data;
    }
    async updateProject(project: Project): Promise<boolean> {
        const response = await axiosJwtProtected.put(`projects/${project.id}`, {
            name: project.name,
        } as Project);
        return response.status === 200;
    }
    async deleteProject(projectId: number): Promise<boolean> {
        const response = await axiosJwtProtected.delete(`projects/${projectId}`);
        return response.status === 204;
    }
    async getPlotsByProject(project: Project): Promise<Plot[]> {
        const response = await axiosJwtProtected.get(`projects/${project.id}/plots`);
        return response.data;
    }
    async getVarietiesByProject(project: Project): Promise<Variety[]> {
        const response = await axiosJwtProtected.get(`projects/${project.id}/varieties`);
        return response.data;
    }
    async getSowingsByProject(project: Project): Promise<Sowing[]> {
        const response = await axiosJwtProtected.get(`projects/${project.id}/sowings`);
        return response.data;
    }
    async addVarietyToProject(project: Project, variety: Variety): Promise<boolean> {
        const response = await axiosJwtProtected.put(`projects/${project.id}/add-variety?${queryParams.variety.id}=${variety.id}`);
        return response.status === 200;
    }
    async removeVarietyToProject(project: Project, variety: Variety): Promise<boolean> {
        const response = await axiosJwtProtected.put(`projects/${project.id}/remove-variety?${queryParams.variety.id}=${variety.id}`);
        return response.status === 200;
    }
    async addUserToProject(project: Project, user: User, roles: string[]): Promise<boolean> {
        const response = await axiosJwtProtected.put(`projects/${project.id}/add-user`, {
            user: {
                email: user.email,
            },
            project: project,
            roles: roles,
        } as ProjectUser);
        return response.status === 200;
    }
}
const projectService = new ProjectService();
export default projectService;