import type { Variety } from "@/models/Variety";
import type { SearchVariety } from "@/models/request/search/SearchVariety";
import specyScript from "@/scripts/SpecyScript";
import { PUBLIC, PaginationLimit } from "@/utils/constant";
import { VALIDITY } from "@/utils/validity";

class VarietyScript {
    init(): Variety {
        return {
            id: 0,
            name: '',
            description: '',
            specy: specyScript.init(),
            valid: VALIDITY.ND.value,
            owner: PUBLIC,
        }
    }
    initSearch(): SearchVariety {
        return {
            name: null,
            exactSearch: false,
            validity: null,
            owner: null,
            searchSpecy: specyScript.initSearch(),
            pagination: {
                total: 0,
                cursor: 0,
                items: 0,
                limit: PaginationLimit.DEFAULT,
                pages: 0,
            }
        }
    }
}
const varietyScript = new VarietyScript();
export default varietyScript;