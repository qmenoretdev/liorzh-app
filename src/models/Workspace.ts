import type { Monitoring } from "./Monitoring"
import type { Plot } from "./Plot"

export interface Workspace {
    monitoringPanel: {
        plot: Plot,
        selectedMonitorings: Monitoring[],
        filters: {
            enabledOnly: boolean,
        },
    }
}