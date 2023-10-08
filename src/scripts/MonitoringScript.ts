import type { Monitoring } from "@/models/Monitoring";
import { MonitoringType } from "@/models/Monitoring";

class MonitoringScript {
    init(): Monitoring {
        return {
            id: 0,
            name: '',
            enabled: true,
            type: MonitoringType.ANNUAL.code,
        }
    }
    getMonitoringTypeLabel(code: string) {
        switch (code) {
            case MonitoringType.ANNUAL.code:
                return MonitoringType.ANNUAL.label;
            case MonitoringType.BI_ANNUAL.code:
                return MonitoringType.BI_ANNUAL.label;
            case MonitoringType.PERSISTENT.code:
                return MonitoringType.PERSISTENT.label;
        }
        return code;
    }
}
const monitoringScript = new MonitoringScript();
export default monitoringScript;