import type { Monitoring } from "@/models/Monitoring";
import { MonitoringType } from "@/models/Monitoring";
class MonitoringScript {
    init(): Monitoring {
        return {
            id: 0,
            name: '',
            enabled: true,
            type: MonitoringType.ANNUAL,
            monitoringLines: [],
        }
    }
    getMonitoringTypeI18nKey(code: string) {
        switch (code) {
            case MonitoringType.PERSISTENT:
                return 'monitoring.types.persistent'
            case MonitoringType.ANNUAL:
                return 'monitoring.types.annual'
            case MonitoringType.BI_ANNUAL:
                return 'monitoring.types.biAnnual'
            default:
                return 'monitoring.types.other'
        }
    }
}
const monitoringScript = new MonitoringScript();
export default monitoringScript;