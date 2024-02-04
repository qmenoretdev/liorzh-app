import type { Variety } from "./Variety";

export interface Sowing {
    id: number;
    sowingDate: string;
    location?: string;
    year?: number;
    variety: Variety;
}