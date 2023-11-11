import type { Variety } from "@/models/Variety";
import { Visibility } from "@/models/Visbility";
import specyScript from "@/scripts/SpecyScript";

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
}
const varietyScript = new VarietyScript();
export default varietyScript;