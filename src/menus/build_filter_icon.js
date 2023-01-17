const d3 = require('d3');
const position_filter_icon = require('./position_filter_icon');
const d3_tip_custom = require('../tooltip/d3_tip_custom');
const toggle_menu = require('./toggle_menu');
const make_filter_menu = require('./make_filter_menu');

module.exports = function build_filter_icon(cgm) {
  const slider_length = 40;
  const params = cgm.params;
  const default_opacity = 0.35;
  const high_opacity = 0.6;

  // d3-tooltip
  const filter_icon_tip = d3_tip_custom()
    .attr('class', function () {
      const root_tip_selector = params.viz.root_tips.replace('.', '');
      const class_string = root_tip_selector + '_filter_icon_tip d3-tip';
      return class_string;
    })
    .direction('w')
    .style('display', 'none')
    .offset([-10, -5])
    .html(function () {
      return 'Filtering Menu';
    });

  const filter_icon_outer_group = d3
    .select(params.root + ' .viz_svg')
    .append('g')
    .classed('filter_icon', true)
    .on('mouseover', function () {
      // only if no menu is showing
      if (d3.select(params.root + ' .filter_menu').empty()) {
        d3.selectAll(params.viz.root_tips + '_filter_icon_tip')
          .style('opacity', 1)
          .style('display', 'block');

        filter_icon_tip.show();
      }

      d3.selectAll(params.root + ' .filter_icon_circle').style(
        'opacity',
        high_opacity
      );
    })
    .on('mouseout', function () {
      filter_icon_tip.hide();
      d3.selectAll(params.root + ' .filter_icon_circle').style(
        'opacity',
        default_opacity
      );
    })
    .call(filter_icon_tip);

  const filter_icon_group = filter_icon_outer_group
    .append('g')
    .classed('filter_container', true)
    .on('click', function () {
      if (d3.select(params.root + ' .filter_menu').empty()) {
        // have to pass make menu function as callback
        toggle_menu(cgm, 'filter_menu', 'open', make_filter_menu);

        filter_icon_tip.hide();
      } else {
        toggle_menu(cgm, 'filter_menu', 'close');
      }
    });

  // d3.select(params.root + ' .filter_container')
  //   .attr('transform', 'scale(1.0)');

  position_filter_icon(cgm);

  const offset_triangle = 0;
  const filter_width = 30;

  // main branch
  filter_icon_group
    .append('path')
    .style('fill', 'black')
    .attr('transform', 'translate(' + offset_triangle + ', 0)')
    .attr('d', function () {
      // up triangle
      const start_x = 0;
      const start_y = 0;

      const mid_x = filter_width / 2; //left_x + slider_length/10;
      const mid_y = slider_length;

      const final_x = filter_width; //left_x + slider_length/5;
      const final_y = 0;

      const output_string =
        'M' +
        start_x +
        ',' +
        start_y +
        ' L' +
        mid_x +
        ', ' +
        mid_y +
        ' L' +
        final_x +
        ',' +
        final_y +
        ' Z';

      return output_string;
    })
    .style('opacity', 0.35);

  filter_icon_group
    .selectAll()
    .data([[filter_width / 2, 0, filter_width / 2]])
    .enter()
    .append('circle')
    .classed('filter_icon_circle', true)
    .attr('r', function (d) {
      return d[2];
    })
    .attr('transform', function (d) {
      return 'translate(' + d[0] + ', ' + d[1] + '), scale(1, 0.4)';
    })
    .attr('fill', 'blue')
    .attr('opacity', default_opacity)
    .attr('');

  filter_icon_group
    .append('rect')
    .attr('width', 50)
    .attr('height', 62)
    .attr('transform', function () {
      return 'translate(' + -15 + ', ' + -19 + ')';
    })
    .attr('opacity', 0.0);
};
