import update_viz_with_view from "../network/update_viz_with_view.js";
import reset_other_filter_sliders from "../filters/reset_other_filter_sliders.js";
export default (function update_view(cgm, filter_type, inst_state) {
    // add something to control slider position
    /////////////////////////////////////////////
    const requested_view = {};
    requested_view[filter_type] = inst_state;
    update_viz_with_view(cgm, requested_view);
    reset_other_filter_sliders(cgm, filter_type, inst_state);
});
