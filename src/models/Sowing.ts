import type { Variety } from "./Variety";

export interface Sowing {
    id: number;
    sowingDate: Date;
    location?: string;
    year?: number;
    variety: Variety;
}