import d3 from "d3";
import two_translate_zoom from "./two_translate_zoom.js";
export default (function ini_doubleclick(cgm) {
    const params = cgm.params;
    // disable double-click zoom
    d3.selectAll(params.viz.zoom_element).on('dblclick.zoom', null);
    d3.select(params.viz.zoom_element).on('dblclick', function () {
        two_translate_zoom(cgm, 0, 0, 1);
    });
});
