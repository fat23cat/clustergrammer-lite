const d3 = require('d3');
const update_viz_with_view = require('../network/update_viz_with_view');
const reset_other_filter_sliders = require('./reset_other_filter_sliders');
const get_current_orders = require('./get_current_orders');
const make_requested_view = require('./make_requested_view');
const utils = require('../Utils_clust');

module.exports = function run_filter_slider(
  cgm,
  filter_type,
  available_views,
  inst_index
) {
  // only update if not running update
  if (d3.select(cgm.params.viz.viz_svg).classed('running_update') === false) {
    var params = cgm.params;

    // get value
    const inst_state = available_views[inst_index][filter_type];

    reset_other_filter_sliders(cgm, filter_type, inst_state);

    params = get_current_orders(params);

    let requested_view = {};
    requested_view[filter_type] = inst_state;

    requested_view = make_requested_view(params, requested_view);

    if (utils.has(available_views[0], 'enr_score_type')) {
      const enr_state = d3
        .select(params.root + ' .toggle_enr_score_type')
        .attr('current_state');

      requested_view.enr_score_type = enr_state;
    }

    update_viz_with_view(cgm, requested_view);
  }
};
