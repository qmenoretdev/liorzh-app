import { axiosJwtProtected } from '@/axios.config';
import type { Sowing } from '@/models/Sowing';
import { useUserStore } from '@/stores/user';
import { toDateTime } from '@/utils/date';
import { queryParams } from '@/utils/queryParams';

class SowingService {
    async createSowing(sowing: Sowing): Promise<Sowing> {
        const userStore = useUserStore();
        const response = await axiosJwtProtected.post('sowings', {
          sowingDate: toDateTime(sowing.sowingDate),
          location: sowing.location,
          year: sowing.year,
          seedsNumber: sowing.seedsNumber,
          description: sowing.description,
          variety: {
            id: sowing.variety.id,
          },
          project: userStore.activeProjectUser.project,
        } as Sowing);
        return response.data;
    }
    async updateSowing(sowing: Sowing): Promise<boolean> {
        const response = await axiosJwtProtected.put(`sowings/${sowing.id}`, {
            sowingDate: toDateTime(sowing.sowingDate),
            location: sowing.location,
            year: sowing.year,
            seedsNumber: sowing.seedsNumber,
            description: sowing.description,
        } as Sowing);
        return response.status === 200;
    }
    async deleteSowing(sowingId: number): Promise<boolean> {
        const response = await axiosJwtProtected.delete(`sowings/${sowingId}`);
        return response.status === 204;
    }
    async getSowingsByVarietyAndProject(varietyId: number): Promise<Sowing[]> {
        const userStore = useUserStore();
        const response = await axiosJwtProtected.get(`sowings?${queryParams.variety.id}=${varietyId}&${queryParams.project.id}=${userStore.activeProjectUser.project.id}`);
        return response.data;
    }
    async getSowing(sowingId: number): Promise<Sowing> {
        const response = await axiosJwtProtected.get(`sowings/${sowingId}`);
        return response.data;
    }
}
const sowingService = new SowingService()
export default sowingService