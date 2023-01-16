import calc_zoom_switching from "../zoom/calc_zoom_switching.js";
export default (function set_zoom_params(params) {
    params.viz.zoom_scale_font = {};
    params.viz.zoom_scale_font.row = 1;
    params.viz.zoom_scale_font.col = 1;
    const max_zoom_limit = 0.75;
    const half_col_height = params.viz.x_scale.rangeBand() / 2;
    params.viz.square_zoom =
        (params.viz.norm_labels.width.col / half_col_height) * max_zoom_limit;
    params.viz = calc_zoom_switching(params.viz);
    return params;
});
