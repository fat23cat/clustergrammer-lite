import d3 from 'd3';
import deactivate_cropping from './deactivate_cropping.js';
import each from 'underscore/modules/each.js';
export default (function brush_crop_matrix() {
  // get rows/cols from brush-extent
  // works for differnt brushing directions (e.g. start end sites)
  const cgm = this;
  const params = cgm.params;
  const clust_width = params.viz.clust.dim.width;
  const clust_height = params.viz.clust.dim.height;
  const x = d3.scale.linear().domain([0, clust_width]).range([0, clust_width]);
  const y = d3.scale
    .linear()
    .domain([0, clust_height])
    .range([0, clust_height]);
  // make brush group
  d3.select(params.root + ' .clust_container')
    .append('g')
    .classed('brush_group', true);
  cgm.params.is_cropping = true;
  const brush = d3.svg.brush().x(x).y(y).on('brushend', brushend);
  d3.select(params.root + ' .brush_group').call(brush);
  function brushend() {
    // do not display dendro crop buttons when cropping with brushing
    d3.select(cgm.params.root + ' .col_dendro_icons_container').style(
      'display',
      'none'
    );
    d3.select(cgm.params.root + ' .row_dendro_icons_container').style(
      'display',
      'none'
    );
    const brushing_extent = brush.extent();
    const brush_start = brushing_extent[0];
    const brush_end = brushing_extent[1];
    const x_start = brush_start[0];
    const x_end = brush_end[0];
    const y_start = brush_start[1];
    const y_end = brush_end[1];
    if (x_start != x_end && y_start != y_end) {
      setTimeout(deactivate_cropping, 500, cgm);
      // find cropped nodes
      const found_nodes = find_cropped_nodes(
        x_start,
        x_end,
        y_start,
        y_end,
        brush_start,
        brush_end
      );
      cgm.filter_viz_using_names(found_nodes);
      d3.select(params.root + ' .crop_button')
        .style('color', '#337ab7')
        .classed('fa-crop', false)
        .classed('fa-undo', true);
    }
  }
  function find_cropped_nodes(
    x_start,
    x_end,
    y_start,
    y_end,
    brush_start,
    brush_end
  ) {
    // reverse if necessary (depending on how brushing was done)
    if (x_start > x_end) {
      x_start = brush_end[0];
      x_end = brush_start[0];
    }
    if (y_start > y_end) {
      y_start = brush_end[1];
      y_end = brush_start[1];
    }
    // add room to brushing
    y_start = y_start - params.viz.rect_height;
    x_start = x_start - params.viz.rect_width;
    const found_nodes = {};
    found_nodes.row = [];
    found_nodes.col = [];
    // d3.selectAll(params.root+' .row_label_group')
    //   .each(function(inst_row){
    //     // there is already bound data on the rows
    //     var inst_trans = d3.select(this)
    //       .attr('transform');
    //     var y_trans = Number(inst_trans.split(',')[1].split(')')[0]);
    //     if (y_trans > y_start && y_trans < y_end){
    //       found_nodes.row.push(inst_row.name);
    //     }
    //   });
    each(params.matrix.matrix, function (row_data) {
      const y_trans = params.viz.y_scale(row_data.row_index);
      if (y_trans > y_start && y_trans < y_end) {
        found_nodes.row.push(row_data.name);
      }
    });
    d3.selectAll(params.root + ' .col_label_text').each(function (inst_col) {
      // there is already bound data on the cols
      const inst_trans = d3.select(this).attr('transform');
      const x_trans = Number(inst_trans.split(',')[0].split('(')[1]);
      if (x_trans > x_start && x_trans < x_end) {
        found_nodes.col.push(inst_col.name);
      }
    });
    return found_nodes;
  }
  d3.selectAll(params.root + ' .extent')
    .style('opacity', 0.2)
    .style('fill', 'black');
});
