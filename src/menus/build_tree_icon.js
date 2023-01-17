const d3 = require('d3');
const d3_tip_custom = require('../tooltip/d3_tip_custom');
const position_tree_icon = require('./position_tree_icon');
const toggle_menu = require('./toggle_menu');
const make_tree_menu = require('./make_tree_menu');

module.exports = function build_tree_icon(cgm) {
  const slider_length = 40;
  const params = cgm.params;
  const default_opacity = 0.35;
  const high_opacity = 0.6;

  // d3-tooltip
  const tree_icon_tip = d3_tip_custom()
    .attr('class', function () {
      const root_tip_selector = params.viz.root_tips.replace('.', '');
      const class_string = root_tip_selector + '_tree_icon_tip d3-tip';
      return class_string;
    })
    .direction('w')
    .style('display', 'none')
    .offset([-10, -5])
    .html(function () {
      return 'Clustering Menu';
    });

  const tree_icon_outer_group = d3
    .select(params.root + ' .viz_svg')
    .append('g')
    .classed('tree_icon', true)
    .on('mouseover', function () {
      // only if no menu is showing
      if (d3.select(params.root + ' .tree_menu').empty()) {
        d3.selectAll(params.viz.root_tips + '_tree_icon_tip')
          .style('opacity', 1)
          .style('display', 'block');

        tree_icon_tip.show();
      }

      d3.selectAll(params.root + ' .tree_leaf_circle').style(
        'opacity',
        high_opacity
      );
    })
    .on('mouseout', function () {
      tree_icon_tip.hide();
      d3.selectAll(params.root + ' .tree_leaf_circle').style(
        'opacity',
        default_opacity
      );
    })
    .call(tree_icon_tip);

  const tree_icon_group = tree_icon_outer_group
    .append('g')
    .classed('dendro_tree_container', true)
    .on('click', function () {
      if (d3.select(params.root + ' .tree_menu').empty()) {
        toggle_menu(cgm, 'tree_menu', 'open', make_tree_menu);

        tree_icon_tip.hide();
      } else {
        toggle_menu(cgm, 'tree_menu', 'close');
      }
    });

  d3.select(params.root + ' .dendro_tree_container').attr(
    'transform',
    'scale(0.9)'
  );

  position_tree_icon(cgm);

  const offset_triangle = 0;
  const tree_width = 20;

  // main branch
  tree_icon_group
    .append('path')
    .style('fill', 'black')
    .attr('transform', 'translate(' + offset_triangle + ', 0)')
    .attr('d', function () {
      // up triangle
      const start_x = 0;
      const start_y = slider_length;

      const mid_x = tree_width / 2; //left_x + slider_length/10;
      const mid_y = 0;

      const final_x = tree_width; //left_x + slider_length/5;
      const final_y = slider_length;

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

  // left branch
  const branch_height = 30;
  tree_icon_group
    .append('path')
    .style('fill', 'black')
    .attr('transform', 'translate(' + offset_triangle + ', 0)')
    .attr('d', function () {
      // up triangle
      const start_x = 4.3;
      const start_y = 23;

      const mid_x = -5; //left_x + slider_length/10;
      const mid_y = branch_height / 2.5;

      const final_x = 5.8; //left_x + slider_length/5;
      const final_y = branch_height / 1.8;

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

  // right branch
  tree_icon_group
    .append('path')
    .style('fill', 'black')
    .attr('transform', 'translate(' + offset_triangle + ', 0)')
    .attr('d', function () {
      // up triangle
      const start_x = 15.7;
      const start_y = 23;

      const mid_x = 25; //left_x + slider_length/10;
      const mid_y = branch_height / 2.5;

      const final_x = 14.2; //left_x + slider_length/5;
      const final_y = branch_height / 1.8;

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

  const small_leaf_offset = 13;
  const small_leaf_radius = 9.5;

  tree_icon_group
    .selectAll()
    .data([
      [-3, small_leaf_offset, small_leaf_radius],
      [tree_width / 2, 0, 17],
      [23, small_leaf_offset, small_leaf_radius]
    ])
    .enter()
    .append('circle')
    .classed('tree_leaf_circle', true)
    .attr('r', function (d) {
      return d[2];
    })
    .attr('transform', function (d) {
      return 'translate(' + d[0] + ', ' + d[1] + ')';
    })
    .attr('fill', 'blue')
    .attr('opacity', default_opacity)
    .attr('');

  tree_icon_group
    .append('rect')
    .attr('width', 50)
    .attr('height', 62)
    .attr('transform', function () {
      return 'translate(' + -15 + ', ' + -19 + ')';
    })
    .attr('opacity', 0.0);
};
