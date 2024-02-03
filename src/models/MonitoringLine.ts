import type { Harvest } from "./Harvest";
import type { Monitoring } from "./Monitoring";
import type { Sowing } from "./Sowing";
import type { Variety } from "./Variety";

export interface MonitoringLine {
    id: number;
    plantNumber?: number;
    description?: string;
    ended: boolean;
    planting?: string;
    variety: Variety;
    monitoring: Monitoring;
    harvest: Harvest;
    sowing?: Sowing;
}