import demo_text from "./demo_text.js";
import two_translate_zoom from "../zoom/two_translate_zoom.js";
import sim_click from "./sim_click.js";
export default (function play_reset_zoom() {
    function run(cgm) {
        const params = cgm.params;
        const text = 'Reset zoom by double-clicking\n';
        demo_text(params, text, 4000);
        setTimeout(sim_click, 2000, params, 'double', 300, 300);
        setTimeout(two_translate_zoom, 2400, cgm, 0, 0, 1);
    }
    function get_duration() {
        return 4500;
    }
    return {
        run: run,
        get_duration: get_duration
    };
});
