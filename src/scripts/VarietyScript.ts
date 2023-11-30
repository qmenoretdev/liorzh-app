import type { Variety } from "@/models/Variety";
import { Visibility } from "@/models/Visibility";
import type { SearchVariety } from "@/models/request/search/SearchVariety";
import specyScript from "@/scripts/SpecyScript";
import { PaginationLimit } from "@/utils/constant";

class VarietyScript {
    init(): Variety {
        return {
            id: 0,
            name: '',
            description: '',
            specy: specyScript.init(),
            visibility: Visibility.PRIVATE,
        }
    }
    initSearch(): SearchVariety {
        return {
            name: null,
            exactSearch: false,
            visibility: null,
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