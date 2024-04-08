import type { Project } from "./Project";
import type { Variety } from "./Variety";

export interface Sowing {
    id: number;
    sowingDate: string;
    location?: string;
    year?: number;
    description: string;
    seedsNumber: number;
    variety: Variety;
    project: Project;
}