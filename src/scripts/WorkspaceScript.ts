import type { Workspace } from "@/models/Workspace";
import plotScript from "@/scripts/PlotScript";

class WorkspaceScript {
    init(): Workspace {
        return {
            monitoringPanel: {
                plot: plotScript.init(),
                selectedMonitorings: [],
                filters: {
                    enabledOnly: false,
                }
            }
        }
    }
}
const workspaceScript = new WorkspaceScript();
export default workspaceScript;