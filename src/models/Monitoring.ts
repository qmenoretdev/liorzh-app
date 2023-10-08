import type { Plot } from "./Plot";

export interface Monitoring {
    id: number;
    type: string;
    name: string;
    enabled: boolean;
    plot?: Plot;
}

export const MonitoringType = {
    PERSISTENT: {
        code: 'persistent',
        label: 'Pérenne',
    },
    BI_ANNUAL: {
       code: 'bi-annual',
       label: 'Bi-annuel'
    },
    ANNUAL: {
        code: 'annual',
        label: 'Annuel'
    },
    OTHER: {
        code: 'other',
        label: 'Autre',
    }
}