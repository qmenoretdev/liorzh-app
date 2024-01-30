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

/**
 *     return {
        PERSISTENT: {
            code: 'persistent',
            label: t('monitoring.types.persistent'),
        },
        BI_ANNUAL: {
            code: 'bi-annual',
            label: t('monitoring.types.biAnnual'),
        },
        ANNUAL: {
            code: 'annual',
            label: t('monitoring.types.annual'),
        },
        OTHER: {
            code: 'other',
            label: t('monitoring.types.other'),
        }
    }
 */

    /*
export const MonitoringType = {
    PERSISTENT: {
        code: 'persistent',
        label: t('monitoring.types.persistent'),
    },
    BI_ANNUAL: {
        code: 'bi-annual',
        label: t('monitoring.types.biAnnual'),
    },
    ANNUAL: {
        code: 'annual',
        label: t('monitoring.types.annual'),
    },
    OTHER: {
        code: 'other',
        label: t('monitoring.types.other'),
    }
}*/