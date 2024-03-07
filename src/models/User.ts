import type { ProjectUser } from "./ProjectUser";

export interface User {
    id: number;
    email: string;
    roles: string[];
    password?: string;
    active: boolean;
    name: string;
    projectUsers: ProjectUser[];
}