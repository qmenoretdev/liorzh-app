import type { Sowing } from "@/models/Sowing";
import varietyScript from "./VarietyScript";

class SowingScript {
    init(): Sowing {
        return {
            id: 0,
            sowingDate: new Date(),
            variety: varietyScript.init(),
        }
    }
}
const sowingScript = new SowingScript();
export default sowingScript;