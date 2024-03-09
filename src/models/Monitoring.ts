import type { MonitoringLine } from "./MonitoringLine";
import type { Plot } from "./Plot";
export interface Monitoring {
    id: number;
    type: string;
    name: string;
    enabled: boolean;
    plot?: Plot;
    monitoringLines?: MonitoringLine[]; 
}

export const MonitoringType = {
    PERSISTENT: 'persistent',
    BI_ANNUAL: 'bi-annual',
    ANNUAL: 'annual',
    OTHER: 'other',
}