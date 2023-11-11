import { axiosJwtProtected } from '@/axios.config';
import type { Specy } from '@/models/Specy';
import type { FormErrorSpecy } from '@/models/form/FormErrorSpecy';
import specyScript from '@/scripts/SpecyScript';

class SpecyService {
    checkForm(specy: Specy): FormErrorSpecy {
        const formError = specyScript.initFormError();
        if (specy.botanicalName === "" || specy.botanicalName == undefined) {
          formError.botanicalNameError = "Le nom botanique est obligatoire";
          formError.valid = false;
        }
        return formError;
    }
    stringCommonNamesToArray(commonNames: string): string[] {
        const commonNamesArray = [];
        if (
            commonNames !== undefined &&
            commonNames.trim().replace(",", "") !== ""
        ) {
            const commonNamesSplit = commonNames.split(",");
            for (const commonName of commonNamesSplit) {
              commonNamesArray.push(commonName.trim());
           }
        }
        return commonNamesArray;
    }
    commonNamesArrayToString(commonNames: string[]) {
        let commonNamesString = "";
        if (
            commonNames &&
            commonNames.length > 0
        ) {
          let index = 0;
          for (const name of commonNames) {
            if (index > 0) {
              commonNamesString += ", ";
            }
            commonNamesString += name;
            index++;
          }
        }
        return commonNamesString;
    }
    async createSpecy(specy: Specy): Promise<Specy> {
        const response = await axiosJwtProtected.post('species', {
            botanicalName: specy.botanicalName,
            upovCode: specy.upovCode,
            frenchCommonNames: specy.frenchCommonNames,
            englishCommonNames: specy.englishCommonNames,
            visibility: specy.visibility,
        } as Specy);
        return response.data;
    }
    async updateSpecy(specy: Specy): Promise<boolean> {
        const response = await axiosJwtProtected.put(`species/${specy.id}`, {
            botanicalName: specy.botanicalName,
            upovCode: specy.upovCode,
            frenchCommonNames: specy.frenchCommonNames,
            englishCommonNames: specy.englishCommonNames,
            visibility: specy.visibility,
        } as Specy);
        return response.status === 200;
    }
    async deleteSpecy(specyId: number): Promise<boolean> {
        const response = await axiosJwtProtected.delete(`species/${specyId}`);
        return response.status === 204;
    }
}
const specyService = new SpecyService()
export default specyService