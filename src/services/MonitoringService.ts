import type { Monitoring } from "@/models/Monitoring";
import { axiosJwtProtected } from '@/axios.config';

class MonitoringService {
    async getMonitoring(monitoringId: number): Promise<Monitoring> {
        const response = await axiosJwtProtected.get(`monitorings/${monitoringId}`);
        return response.data;
    }
    async getMonitoringsByPlot(plotId: number): Promise<Monitoring[]> {
        const response = await axiosJwtProtected.get(`monitorings?plotId=${plotId}`);
        return response.data;
    }
    async createMonitoring(monitoring: Monitoring): Promise<Monitoring> {
        const response = await axiosJwtProtected.post('monitorings', {
            name: monitoring.name,
            type: monitoring.type,
            enabled: monitoring.enabled,
            plot: {
                id: monitoring.plot?.id,
            },
        } as Monitoring);
        return response.data;
    }
    async updateMonitoring(monitoring: Monitoring): Promise<boolean> {
        const response = await axiosJwtProtected.put(`monitorings/${monitoring.id}`, {
            name: monitoring.name,
            type: monitoring.type,
            enabled: monitoring.enabled,
        } as Monitoring);
        return response.status === 200;
    }
    async deleteMonitoring(monitoringId: number): Promise<boolean> {
        const response = await axiosJwtProtected.delete(`monitorings/${monitoringId}`);
        return response.status === 204;
    }
}
const monitoringService = new MonitoringService();
export default monitoringService;