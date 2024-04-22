import type { Plot } from "@/models/Plot";
import { axiosJwtProtected } from '@/axios.config';
import { useUserStore } from "@/stores/user";

class PlotService {
    async getPlot(plotId: number): Promise<Plot> {
        const response = await axiosJwtProtected.get(`plots/${plotId}`)
        return response.data
    }
    async createPlot(plot: Plot): Promise<Plot> {
        const userStore = useUserStore();
        const response = await axiosJwtProtected.post('plots', {
            name: plot.name,
            country: plot.country,
            region: plot.region,
            subRegion: plot.subRegion,
            city: plot.city,
            description: plot.description,
            project: userStore.activeProjectUser.project,
        } as Plot);
        return response.data;
    }
    async updatePlot(plot: Plot): Promise<boolean> {
        const response = await axiosJwtProtected.put(`plots/${plot.id}`, {
            name: plot.name,
            country: plot.country,
            region: plot.region,
            subRegion: plot.subRegion,
            city: plot.city,
            description: plot.description,
        } as Plot);
        return response.status === 200;
    }
    async deletePlot(plotId: number): Promise<boolean> {
        const response = await axiosJwtProtected.delete(`plots/${plotId}`);
        return response.status === 204;
    }
}
const plotService = new PlotService();
export default plotService;