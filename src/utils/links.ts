import type { Monitoring } from "@/models/Monitoring";
import type { MonitoringLine } from "@/models/MonitoringLine";
import type { Plot } from "@/models/Plot";
import type { Project } from "@/models/Project";
import type { Sowing } from "@/models/Sowing";
import type { Variety } from "@/models/Variety";

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
    plotCreate() {
        return { name: "PlotCreate" }
    }
    plotUpdate(plot: Plot) {
        return { name: "PlotUpdate", params: { id: plot.id } }
    }
    varietyCreate() {
        return { name: "VarietyCreate" }
    }
    varietyUpdate(variety: Variety) {
        return { name: "VarietyUpdate", params: { id: variety.id } }
    }
    sowingCreate() {
        return { name: "SowingCreate" }
    }
    sowingUpdate(sowing: Sowing) {
        return { name: "SowingUpdate", params: { id: sowing.id } }
    }
    projectCreate() {
        return { name: "ProjectCreate" }
    }
    projectUpdate(project: Project) {
        return { name: "ProjectUpdate", params: { id: project.id } }
    }
    projectAddUser(project: Project) {
        return { name: "ProjectAddUser", params: { id: project.id } }
    }
    workspace() {
        return { name: 'workspace' }
    }
}

const links = new Links()
export default links