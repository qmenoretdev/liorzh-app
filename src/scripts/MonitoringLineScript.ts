import type { MonitoringLine } from "@/models/MonitoringLine";
import monitoringScript from "./MonitoringScript";
import varietyScript from "./VarietyScript";
import sowingScript from "./Sowing";

class MonitoringLineScript {
    init(): MonitoringLine {
        return {
            id: 0,
            ended: false,
            description: '',
            sowing: sowingScript.init(),
            monitoring: monitoringScript.init(),
            variety: varietyScript.init(),
        }
    }
}
const monitoringLineScript = new MonitoringLineScript();
export default monitoringLineScript;