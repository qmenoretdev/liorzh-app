import { axiosJwtProtected } from '@/axios.config';
import type { Specy } from '@/models/Specy';
import type { Variety } from '@/models/Variety';

class VarietyService {
    async createVariety(variety: Variety): Promise<Variety> {
        const response = await axiosJwtProtected.post('varieties', {
            name: variety.name,
            description: variety.description,
            specy: {
                id: variety.specy.id,
            } as Specy,
            visibility: variety.visibility,
        } as Variety);
        return response.data;
    }
    async updateVariety(variety: Variety): Promise<boolean> {
        const response = await axiosJwtProtected.put(`varieties/${variety.id}`, {
            name: variety.name,
            description: variety.description,
            specy: {
                id: variety.specy.id,
            } as Specy,
            visibility: variety.visibility,
        } as Variety);
        return response.status === 200;
    }
    async deleteVariety(varietyId: number): Promise<boolean> {
        const response = await axiosJwtProtected.delete(`varieties/${varietyId}`);
        return response.status === 204;
    }
    async getVarietiesByCurrentUser(): Promise<Variety[]> {
        const response = await axiosJwtProtected.get('user-varieties/me');
        return response.data;
    }
    async addUserToVariety(variety: Variety): Promise<boolean> {
        const response = await axiosJwtProtected.put(`varieties/${variety.id}/add-user`);
        return response.status === 200;
    }
    async removeUserFromVariety(variety: Variety): Promise<boolean> {
        const response = await axiosJwtProtected.put(`varieties/${variety.id}/remove-user`);
        return response.status === 200;
    }
}
const varietyService = new VarietyService()
export default varietyService