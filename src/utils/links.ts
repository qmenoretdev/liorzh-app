import type { Monitoring } from "@/models/Monitoring";
import type { MonitoringLine } from "@/models/MonitoringLine";

export class Links {
    monitoringLineUpdate(monitoringLine: MonitoringLine) {
        return { name: "MonitoringLineUpdate", params: { id: monitoringLine.id } }
    }
    addMonitoringLine(monitoring: Monitoring) {
        return { name: "MonitoringLineCreate", query: { monitoringId: monitoring.id } }
    }
    monitoringLineCreate() {
        return { name: "MonitoringLineCreate" }
    }
}

const links = new Links()
export default links