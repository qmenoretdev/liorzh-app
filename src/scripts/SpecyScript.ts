import type { Specy } from "@/models/Specy";
import { Visibility } from "@/models/Visbility";
import type { FormErrorSpecy } from "@/models/form/FormErrorSpecy";
import type { SearchSpecy } from "@/models/request/search/SearchSpecy";
import { PaginationLimit } from "@/utils/constant";

class SpecyScript {
    init(): Specy {
        return {
            id: 0,
            botanicalName: '',
            upovCode: null,
            frenchCommonNames: [] as string[],
            englishCommonNames: [] as string[],
            visibility: Visibility.PRIVATE,
        }
    }
    initSearch(): SearchSpecy {
        return {
            botanicalName: null,
            frenchCommonName: null,
            englishCommonName: null,
            visibility: Visibility.PUBLIC,
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