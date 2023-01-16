import d3 from "d3";
import run_transformation from "./run_transformation.js";
import zoom_rules_y from "./zoom_rules_y.js";
import zoom_rules_x from "./zoom_rules_x.js";
export default (function zoomed(cgm) {
    const params = cgm.params;
    const zoom_info = {};
    zoom_info.zoom_x = d3.event.scale;
    zoom_info.zoom_y = d3.event.scale;
    // subtract away the margin to easily calculate pan_room etc.
    zoom_info.trans_x =
        params.zoom_behavior.translate()[0] - params.viz.clust.margin.left;
    zoom_info.trans_y =
        params.zoom_behavior.translate()[1] - params.viz.clust.margin.top;
    d3.selectAll(params.viz.root_tips).style('display', 'none');
    // transfer zoom_info to params
    params.zoom_info = zoom_rules_y(params, zoom_info);
    params.zoom_info = zoom_rules_x(params, zoom_info);
    // do not run transformation if moving slider
    if (params.is_slider_drag === false && params.is_cropping === false) {
        // reset translate vector - add back margins to trans_x and trans_y
        const new_x = params.zoom_info.trans_x + params.viz.clust.margin.left;
        const new_y = params.zoom_info.trans_y + params.viz.clust.margin.top;
        params.zoom_behavior.translate([new_x, new_y]);
        cgm.params = params;
        run_transformation(cgm);
    }
    dispatchEvent(new CustomEvent('ON_VIZ_RESIZE'));
});
