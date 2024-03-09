import type { Project } from "./Project";
import type { User } from "./User";

export interface ProjectUser {
    id: number;
    project: Project;
    user?: User;
    roles: string[];
    active: boolean;
}