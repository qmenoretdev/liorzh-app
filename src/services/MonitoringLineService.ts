import type { MonitoringLine } from "@/models/MonitoringLine";
import { axiosJwtProtected } from '@/axios.config';
import { toDateTime } from "@/utils/date";

class MonitoringLineService {
    async getMonitoringLinesByMonitoring(monitoringId: number): Promise<MonitoringLine[]> {
        const response = await axiosJwtProtected.get(`monitoring-lines?monitoringId=${monitoringId}`);
        return response.data;
    }
    async createMonitoringLine(monitoringLine: MonitoringLine): Promise<MonitoringLine> {
        const response = await axiosJwtProtected.post('monitoring-lines', {
            plantNumber: monitoringLine.plantNumber,
            ended: monitoringLine.ended,
            description: monitoringLine.description,
            planting: toDateTime(monitoringLine.planting),
            harvest: {
                number: monitoringLine.harvest?.number,
                weight: monitoringLine.harvest?.weight,
                start: toDateTime(monitoringLine.harvest?.start),
                stop: toDateTime(monitoringLine.harvest?.stop),
            },
            monitoring: {
                id: monitoringLine.monitoring.id,
            },
            variety: {
                id: monitoringLine.variety.id,
            },
            sowing: {
                id: monitoringLine.sowing?.id,
            }
        } as MonitoringLine);
        return response.data;
    }
    async updateMonitoringLine(monitoringLine: MonitoringLine): Promise<boolean> {
        const response = await axiosJwtProtected.put(`monitoring-lines/${monitoringLine.id}`, {
            plantNumber: monitoringLine.plantNumber,
            ended: monitoringLine.ended,
            description: monitoringLine.description,
            planting: toDateTime(monitoringLine.planting),
            harvest: {
                id: monitoringLine.harvest?.id,
                number: monitoringLine.harvest?.number,
                weight: monitoringLine.harvest?.weight,
                start: toDateTime(monitoringLine.harvest?.start),
                stop: toDateTime(monitoringLine.harvest?.stop),
            },
            sowing: {
                id: monitoringLine.sowing?.id,
            }
        } as MonitoringLine);
        return response.status === 200;
    }
    async deleteMonitoringLine(monitoringLineId: number): Promise<boolean> {
        const response = await axiosJwtProtected.delete(`monitoring-lines/${monitoringLineId}`);
        return response.status === 204;
    }
}
const monitoringLineService = new MonitoringLineService();
export default monitoringLineService;