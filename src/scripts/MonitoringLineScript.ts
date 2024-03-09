import type { MonitoringLine } from "@/models/MonitoringLine";
import monitoringScript from "./MonitoringScript";
import varietyScript from "./VarietyScript";
import sowingScript from "./SowingScript";
import type { Harvest } from "@/models/Harvest";

class MonitoringLineScript {
    init(): MonitoringLine {
        return {
            id: 0,
            ended: false,
            description: '',
            sowing: sowingScript.init(),
            monitoring: monitoringScript.init(),
            variety: varietyScript.init(),
            harvest: this.initHarvest(),
        }
    }

    initHarvest(): Harvest {
        return {
            id: 0,
            number: 0,
            weight: 0,
        }
    }
}
const monitoringLineScript = new MonitoringLineScript();
export default monitoringLineScript;