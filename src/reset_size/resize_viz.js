import d3 from 'd3';
import utils from '../Utils_clust.js';
import run_zoom from '../zoom/run_zoom.js';
import ini_doubleclick from '../zoom/ini_doubleclick.js';
import reset_zoom from '../zoom/reset_zoom.js';
import resize_dendro from './resize_dendro.js';
import resize_super_labels from './resize_super_labels.js';
import resize_spillover from './resize_spillover.js';
import resize_borders from './resize_borders.js';
import resize_row_labels from './resize_row_labels.js';
import resize_highlights from './resize_highlights.js';
import resize_row_viz from './resize_row_viz.js';
import resize_col_labels from './resize_col_labels.js';
import resize_col_text from './resize_col_text.js';
import resize_col_triangle from './resize_col_triangle.js';
import resize_col_hlight from './resize_col_hlight.js';
import recalc_params_for_resize from './recalc_params_for_resize.js';
import resize_row_tiles from './resize_row_tiles.js';
import resize_label_bars from './resize_label_bars.js';
import label_constrain_and_trim from '../labels/label_constrain_and_trim.js';
import make_dendro_triangles from '../dendrogram/make_dendro_triangles.js';
import toggle_dendro_view from '../dendrogram/toggle_dendro_view.js';
import show_visible_area from '../zoom/show_visible_area.js';
import calc_viz_dimensions from '../params/calc_viz_dimensions.js';
import position_play_button from '../demo/position_play_button.js';
import make_row_cat_super_labels from '../labels/make_row_cat_super_labels.js';
import ini_cat_reorder from '../reorder/ini_cat_reorder.js';
import position_dendro_slider from '../dendrogram/position_dendro_slider.js';
import position_tree_icon from '../menus/position_tree_icon.js';
import position_filter_icon from '../menus/position_filter_icon.js';
import position_tree_menu from '../menus/position_tree_menu.js';
import ini_zoom_info from '../zoom/ini_zoom_info.js';
import grid_lines_viz from '../matrix/grid_lines_viz.js';
import each from 'underscore/modules/each';
export default (function resize_viz(cgm) {
  let params = cgm.params;
  const cont_dim = calc_viz_dimensions(params);
  d3.select(params.root + ' .play_button');
  // .style('opacity', 0.2);
  d3.select(params.root + ' .sidebar_wrapper').style(
    'height',
    cont_dim.height + 'px'
  );
  d3.select(params.viz.viz_wrapper)
    // .style('float', 'left')
    .style('margin-top', cont_dim.top + 'px')
    .style('width', cont_dim.width + 'px')
    .style('height', cont_dim.height + 'px');
  params = recalc_params_for_resize(params);
  params.zoom_info = ini_zoom_info();
  reset_zoom(params);
  const svg_group = d3.select(params.viz.viz_svg);
  // redefine x and y positions
  each(params.network_data.links, function (d) {
    d.x = params.viz.x_scale(d.target);
    d.y = params.viz.y_scale(d.source);
  });
  // disable zoom while transitioning
  svg_group.on('.zoom', null);
  params.zoom_behavior
    .scaleExtent([1, params.viz.square_zoom * params.viz.zoom_ratio.x])
    .on('zoom', function () {
      run_zoom(cgm);
    });
  // reenable zoom after transition
  if (params.viz.do_zoom) {
    svg_group.call(params.zoom_behavior);
  }
  // prevent normal double click zoom etc
  ini_doubleclick(cgm);
  svg_group
    .attr('width', params.viz.svg_dim.width)
    .attr('height', params.viz.svg_dim.height);
  svg_group
    .select('.super_background')
    .style('width', params.viz.svg_dim.width)
    .style('height', params.viz.svg_dim.height);
  svg_group
    .select('.grey_background')
    .attr('width', params.viz.clust.dim.width)
    .attr('height', params.viz.clust.dim.height);
  setTimeout(position_play_button, 100, params);
  const row_nodes = params.network_data.row_nodes;
  const row_nodes_names = utils.pluck(row_nodes, 'name') || [];
  resize_row_tiles(params, svg_group);
  svg_group
    .selectAll('.highlighting_rect')
    .attr('width', params.viz.x_scale.rangeBand() * 0.8)
    .attr('height', params.viz.y_scale.rangeBand() * 0.8);
  resize_highlights(params);
  // resize row labels
  ///////////////////////////
  resize_row_labels(params, svg_group);
  resize_row_viz(params, svg_group);
  // change the size of the highlighting rects
  svg_group.selectAll('.row_label_group').each(function () {
    const bbox = d3.select(this).select('text')[0][0].getBBox();
    d3.select(this)
      .select('rect')
      .attr('x', bbox.x)
      .attr('y', 0)
      .attr('width', bbox.width)
      .attr('height', params.viz.rect_height)
      .style('fill', 'yellow')
      .style('opacity', function (d) {
        let inst_opacity = 0;
        // highlight target genes
        if (d.target === 1) {
          inst_opacity = 1;
        }
        return inst_opacity;
      });
  });
  // necessary to properly position row labels vertically
  svg_group
    .selectAll('.row_label_group')
    .select('text')
    .attr(
      'y',
      params.viz.rect_height * 0.5 + params.labels.default_fs_row * 0.35
    );
  if (utils.has(params.network_data.row_nodes[0], 'value')) {
    resize_label_bars(cgm, svg_group);
  }
  svg_group.selectAll('.row_cat_group').attr('transform', function (d) {
    const inst_index = row_nodes_names.indexOf(d.name);
    return 'translate(0, ' + params.viz.y_scale(inst_index) + ')';
  });
  svg_group
    .selectAll('.row_cat_group')
    .select('path')
    .attr('d', function () {
      const origin_x = params.viz.cat_room.symbol_width - 1;
      const origin_y = 0;
      const mid_x = 1;
      const mid_y = params.viz.rect_height / 2;
      const final_x = params.viz.cat_room.symbol_width - 1;
      const final_y = params.viz.rect_height;
      const output_string =
        'M ' +
        origin_x +
        ',' +
        origin_y +
        ' L ' +
        mid_x +
        ',' +
        mid_y +
        ' L ' +
        final_x +
        ',' +
        final_y +
        ' Z';
      return output_string;
    });
  const is_resize = true;
  if (params.viz.show_dendrogram) {
    make_dendro_triangles(cgm, 'row', is_resize);
    make_dendro_triangles(cgm, 'col', is_resize);
    resize_dendro(params, svg_group);
    toggle_dendro_view(cgm, 'row', 0);
    toggle_dendro_view(cgm, 'col', 0);
  } else {
    resize_dendro(params, svg_group);
  }
  resize_col_labels(params, svg_group);
  resize_col_text(params, svg_group);
  resize_col_triangle(params, svg_group);
  resize_col_hlight(params, svg_group);
  resize_super_labels(params, svg_group);
  resize_spillover(params.viz, svg_group);
  grid_lines_viz(params);
  resize_borders(params, svg_group);
  // reset zoom and translate
  params.zoom_behavior
    .scale(1)
    .translate([params.viz.clust.margin.left, params.viz.clust.margin.top]);
  label_constrain_and_trim(params);
  // reposition matrix
  d3.select(params.root + ' .clust_container').attr(
    'transform',
    'translate(' +
      params.viz.clust.margin.left +
      ',' +
      params.viz.clust.margin.top +
      ')'
  );
  // removed, this was causing bugs
  if (cgm.params.viz.ds_level === -1) {
    show_visible_area(cgm);
  }
  make_row_cat_super_labels(cgm);
  d3.select(params.viz.viz_svg).style('opacity', 1);
  ini_cat_reorder(cgm);
  d3.select(cgm.params.root + ' .row_slider_group').style('opacity', 0);
  d3.select(cgm.params.root + ' .col_slider_group').style('opacity', 0);
  setTimeout(position_dendro_slider, 500, cgm, 'row');
  setTimeout(position_dendro_slider, 500, cgm, 'col');
  setTimeout(position_tree_icon, 500, cgm);
  setTimeout(position_tree_menu, 500, cgm);
  setTimeout(position_filter_icon, 500, cgm);
});
