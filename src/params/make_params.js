import make_network_using_view from "../network/make_network_using_view.js";
import make_requested_view from "../filters/make_requested_view.js";
import get_available_filters from "./get_available_filters.js";
import calc_viz_params from "./calc_viz_params.js";
import ini_zoom_info from "../zoom/ini_zoom_info.js";
import * as $ from "jquery";
export default (function make_params(input_config) {
    const config = $.extend(true, {}, input_config);
    let params = config;
    // keep a copy of inst_view
    params.inst_nodes = {};
    params.inst_nodes.row_nodes = params.network_data.row_nodes;
    params.inst_nodes.col_nodes = params.network_data.col_nodes;
    // when pre-loading the visualization using a view
    if (params.ini_view !== null) {
        let requested_view = params.ini_view;
        const filters = get_available_filters(params.network_data.views);
        params.viz = {};
        params.viz.possible_filters = filters.possible_filters;
        params.viz.filter_data = filters.filter_data;
        requested_view = make_requested_view(params, requested_view);
        params.network_data = make_network_using_view(config, params, requested_view);
        // save ini_view as requested_view
        params.requested_view = requested_view;
    }
    params = calc_viz_params(params);
    // customization
    // if (params.use_sidebar) {
    //   params.sidebar = ini_sidebar_params(params);
    // }
    params.zoom_info = ini_zoom_info();
    return params;
});
