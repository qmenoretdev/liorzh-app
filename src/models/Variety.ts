import type { Specy } from "./Specy";

export interface Variety {
    id: number;
    name: string;
    specy: Specy;
    description: string;
    valid: string;
    owner: string;
}