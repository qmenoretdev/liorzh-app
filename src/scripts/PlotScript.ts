import type { Plot } from "@/models/Plot";

class PlotScript {
    init(): Plot {
        return {
            id: 0,
            description: null,
            country: null,
            region: null,
            name: '',
            city: null,
            subRegion: null,
        }
    }
}
const plotScript = new PlotScript();
export default plotScript;