import demo_text from "./demo_text.js";
import two_translate_zoom from "../zoom/two_translate_zoom.js";
export default (function play_zoom() {
    function run(cgm) {
        const params = cgm.params;
        const text = 'Zoom and pan by\nscrolling and dragging';
        demo_text(params, text, 4000);
        setTimeout(two_translate_zoom, 1500, cgm, 0, 0, 4);
    }
    function get_duration() {
        return 4000;
    }
    return {
        run: run,
        get_duration: get_duration
    };
});
