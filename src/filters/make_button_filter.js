// var update_network = require('../network/update_network');
const make_requested_view = require('./make_requested_view');
const $ = require('jquery');
const d3 = require('d3');

module.exports = function make_button_filter(
  config,
  params,
  filter_type,
  div_filters
) {
  /*
  Enrichr specific code
  */

  const buttons = div_filters
    .append('div')
    .classed('categorical_filter', true)
    .classed('toggle_' + filter_type, true)
    .classed('btn-group-vertical', true)
    .style('width', '100%')
    .style('margin-top', '10px')
    .attr('current_state', 'combined_score');

  const filter_options = params.viz.filter_data[filter_type];

  const button_dict = {
    combined_score: 'Combined Score',
    pval: 'P-Value',
    zscore: 'Z-score'
  };

  buttons
    .selectAll('button')
    .data(filter_options)
    .enter()
    .append('button')
    .attr('type', 'button')
    .classed('btn', true)
    .classed('btn-primary', true)
    .classed('.filter_button', true)
    .classed('active', function (d) {
      let is_active = false;
      if (d == 'combined_score') {
        is_active = true;
      }
      return is_active;
    })
    .attr('name', function (d) {
      return d;
    })
    .html(function (d) {
      return button_dict[d];
    });

  $(params.root + ' .categorical_filter .btn')
    .off()
    .click(function () {
      d3.selectAll(params.root + ' .categorical_filter .btn').classed(
        'active',
        false
      );

      d3.select(this).classed('active', true);

      const inst_state = d3.select(this).attr('name');

      const requested_view = { enr_score_type: inst_state };

      make_requested_view(params, requested_view);

      d3.select(params.root + ' .toggle_enr_score_type').attr(
        'current_state',
        inst_state
      );
    });
};
