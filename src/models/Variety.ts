import type { Specy } from "./Specy";

export interface Variety {
    id: number;
    name: string;
    specy: Specy;
    visibility: string;
    description: string;
}