const make_network_using_view = require('../network/make_network_using_view');
// var ini_sidebar_params = require('./ini_sidebar_params');
const make_requested_view = require('../filters/make_requested_view');
const get_available_filters = require('./get_available_filters');
const calc_viz_params = require('./calc_viz_params');
const ini_zoom_info = require('../zoom/ini_zoom_info');
const $ = require('jquery');

/*
Params: calculates the size of all the visualization elements in the
clustergram.
 */

module.exports = function make_params(input_config) {
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
    params.network_data = make_network_using_view(
      config,
      params,
      requested_view
    );

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
};
