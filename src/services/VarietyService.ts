import { axiosJwtProtected } from '@/axios.config';
import type { Specy } from '@/models/Specy';
import type { Variety } from '@/models/Variety';
import type { SearchVariety } from '@/models/request/search/SearchVariety';

class VarietyService {
    async createVariety(variety: Variety): Promise<Variety> {
        const response = await axiosJwtProtected.post('varieties', {
            name: variety.name,
            description: variety.description,
            specy: {
                id: variety.specy.id,
            } as Specy,
            valid: variety.valid,
            owner: variety.owner,
        } as Variety);
        return response.data;
    }
    async updateVariety(variety: Variety): Promise<boolean> {
        const response = await axiosJwtProtected.put(`varieties/${variety.id}`, variety);
        return response.status === 200;
    }
    async deleteVariety(varietyId: number): Promise<boolean> {
        const response = await axiosJwtProtected.delete(`varieties/${varietyId}`);
        return response.status === 204;
    }
    async searchVarieties(searchVariety: SearchVariety): Promise<Variety[]> {
        const response = await axiosJwtProtected.post('varieties/search', searchVariety);
        return response.data;
    }
    async publishVariety(varietyId: number): Promise<Variety> {
        const response = await axiosJwtProtected.post(`varieties/${varietyId}/publish`);
        return response.data;
    }
}
const varietyService = new VarietyService()
export default varietyService