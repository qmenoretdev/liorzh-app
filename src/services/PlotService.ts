import type { Plot } from "@/models/Plot";
import { axiosJwtProtected } from '@/axios.config';

class PlotService {
    async getPlots(): Promise<Plot[]> {
        const response = await axiosJwtProtected.get('plots');
        return response.data;
    }
    async createPlot(plot: Plot): Promise<Plot> {
        const response = await axiosJwtProtected.post('plots', {
            name: plot.name,
            country: plot.country,
            region: plot.region,
            subRegion: plot.subRegion,
            city: plot.city,
            description: plot.description,
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