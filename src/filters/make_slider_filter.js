const make_filter_title = require('./make_filter_title');
const run_filter_slider = require('./run_filter_slider');
const get_filter_default_state = require('./get_filter_default_state');
const get_subset_views = require('./get_subset_views');
const d3 = require('d3');
d3.slider = require('../d3.slider');
const debounce = require('underscore/modules/debounce');

module.exports = function make_slider_filter(cgm, filter_type, div_filters) {
  const params = cgm.params;
  const inst_view = {};

  const possible_filters = Object.keys(params.viz.possible_filters || {});

  possible_filters.forEach(function (tmp_filter) {
    if (tmp_filter != filter_type) {
      const default_state = get_filter_default_state(
        params.viz.filter_data,
        tmp_filter
      );
      inst_view[tmp_filter] = default_state;
    }
  });

  const filter_title = make_filter_title(params, filter_type);

  div_filters
    .append('div')
    .classed('title_' + filter_type, true)
    .classed('sidebar_text', true)
    .classed('slider_description', true)
    .style('margin-top', '5px')
    .style('margin-bottom', '3px')
    .text(filter_title.text + filter_title.state + filter_title.suffix);

  div_filters
    .append('div')
    .classed('slider_' + filter_type, true)
    .classed('slider', true)
    .attr('current_state', filter_title.state);

  const views = params.network_data.views;

  let available_views = get_subset_views(params, views, inst_view);

  // sort available views by filter_type value
  available_views = available_views.sort(function (a, b) {
    return b[filter_type] - a[filter_type];
  });

  const inst_max = available_views.length - 1;

  let ini_value = 0;
  // change the starting position of the slider if necessary
  if (params.requested_view !== null && filter_type in params.requested_view) {
    const inst_filter_value = params.requested_view[filter_type];

    if (inst_filter_value != 'all') {
      const found_value = available_views
        .map(function (e) {
          return e[filter_type];
        })
        .indexOf(inst_filter_value);

      if (found_value > 0) {
        ini_value = found_value;
      }
    }
  }

  // Filter Slider
  //////////////////////////////////////////////////////////////////////
  const slide_filter_fun = d3
    .slider()
    .value(ini_value)
    .min(0)
    .max(inst_max)
    .step(1)
    .on('slide', function (evt, value) {
      run_filter_slider_db(cgm, filter_type, available_views, value);
    })
    .on('slideend', function (evt, value) {
      run_filter_slider_db(cgm, filter_type, available_views, value);
    });

  // save slider function in order to reset value later
  cgm.slider_functions[filter_type] = slide_filter_fun;

  d3.select(cgm.params.root + ' .slider_' + filter_type).call(slide_filter_fun);

  //////////////////////////////////////////////////////////////////////

  const run_filter_slider_db = debounce(run_filter_slider, 800);
};
