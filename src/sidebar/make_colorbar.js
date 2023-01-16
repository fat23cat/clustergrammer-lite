const d3 = require('d3');
const max = require('underscore/modules/max.js');
const min = require('underscore/modules/min.js');

module.exports = function make_colorbar(cgm) {
  const params = cgm.params;

  d3.select(params.root + ' .sidebar_wrapper')
    .append('div')
    .classed('sidebar_text', true)
    .style('padding-left', '10px')
    .style('padding-top', '5px')
    .text('Matrix Values');

  const colorbar_width = params.sidebar.width - 20;
  const colorbar_height = 13;
  const svg_height = 3 * colorbar_height;
  const svg_width = 1.2 * colorbar_width;
  const low_left_margin = 10;
  const top_margin = 33;
  const high_left_margin = colorbar_width + 10;
  const bar_margin_left = 10;
  const bar_margin_top = 3;

  const network_data = params.network_data;

  const max_link = max(network_data.links, function (d) {
    return d.value;
  }).value;

  const min_link = min(network_data.links, function (d) {
    return d.value;
  }).value;

  const main_svg = d3
    .select(params.root + ' .sidebar_wrapper')
    .append('svg')
    .attr('height', svg_height + 'px')
    .attr('width', svg_width + 'px');

  //Append a defs (for definition) element to your SVG
  const defs = main_svg.append('defs');

  //Append a linearGradient element to the defs and give it a unique id
  const linearGradient = defs
    .append('linearGradient')
    .attr('id', 'linear-gradient');

  let special_case = 'none';

  // no negative numbers
  if (min_link >= 0) {
    //Set the color for the start (0%)
    linearGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', 'white');

    //Set the color for the end (100%)
    linearGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'red');

    special_case = 'all_postiive';

    // no positive numbers
  } else if (max_link <= 0) {
    //Set the color for the start (0%)
    linearGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', 'blue');

    //Set the color for the end (100%)
    linearGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'white');

    special_case = 'all_negative';
  }

  // both postive and negative numbers
  else {
    //Set the color for the start (0%)
    linearGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', 'blue');

    //Set the color for the end (100%)
    linearGradient
      .append('stop')
      .attr('offset', '50%')
      .attr('stop-color', 'white');

    //Set the color for the end (100%)
    linearGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'red');
  }

  // make colorbar
  main_svg
    .append('rect')
    .classed('background', true)
    .attr('height', colorbar_height + 'px')
    .attr('width', colorbar_width + 'px')
    .attr('fill', 'url(#linear-gradient)')
    .attr(
      'transform',
      'translate(' + bar_margin_left + ', ' + bar_margin_top + ')'
    )
    .attr('stroke', 'grey')
    .attr('stroke-width', '0.25px');

  // make title
  ///////////////

  const max_abs_val = Math.abs(Math.round(params.matrix.max_link * 10) / 10);
  const font_size = 13;

  main_svg
    .append('text')
    .text(function () {
      let inst_string;
      if (special_case === 'all_postiive') {
        inst_string = 0;
      } else {
        inst_string = '-' + max_abs_val.toLocaleString();
      }
      return inst_string;
    })
    .style('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .style('font-weight', 300)
    .style('font-size', font_size)
    .attr('transform', 'translate(' + low_left_margin + ',' + top_margin + ')')
    .attr('text-anchor', 'start');

  main_svg
    .append('text')
    .text(max_abs_val.toLocaleString())
    .text(function () {
      let inst_string;
      if (special_case === 'all_negative') {
        inst_string = 0;
      } else {
        inst_string = max_abs_val.toLocaleString();
      }
      return inst_string;
    })
    .style('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .style('font-weight', 300)
    .style('font-size', font_size)
    .attr('transform', 'translate(' + high_left_margin + ',' + top_margin + ')')
    .attr('text-anchor', 'end');
};
