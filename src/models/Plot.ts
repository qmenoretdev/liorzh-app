import type { Project } from "./Project";

export interface Plot {
    id: number;
    name: string;
    description: string | null;
    country: string | null;
    region: string | null;
    subRegion: string | null;
    city: string | null;
    project: Project | null;
}