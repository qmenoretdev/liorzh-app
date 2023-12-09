import type { Specy } from "@/models/Specy";
import type { FormErrorSpecy } from "@/models/form/FormErrorSpecy";
import type { SearchSpecy } from "@/models/request/search/SearchSpecy";
import { PUBLIC, PaginationLimit } from "@/utils/constant";
import { VALIDITY } from "@/utils/validity";

class SpecyScript {
    init(): Specy {
        return {
            id: 0,
            botanicalName: '',
            upovCode: null,
            frenchCommonNames: [] as string[],
            englishCommonNames: [] as string[],
            valid: VALIDITY.ND.value,
            owner: PUBLIC,
        }
    }
    initSearch(): SearchSpecy {
        return {
            botanicalName: null,
            frenchCommonName: null,
            englishCommonName: null,
            validity: null,
            owner: null,
            exactSearch: false,
            pagination: {
                total: 0,
                cursor: 0,
                items: 0,
                limit: PaginationLimit.DEFAULT,
                pages: 0,
            }
        }
    }
    initFormError(): FormErrorSpecy {
      return {
        botanicalNameError: "",
        valid: true,
      };
    }
}
const specyScript = new SpecyScript();
export default specyScript;