const d3 = require('d3');
const make_dendro_crop_buttons = require('../dendrogram/make_dendro_crop_buttons');

module.exports = function make_row_dendro_spillover(cgm) {
  const viz = cgm.params.viz;

  // hide spillover from right
  const tmp_left =
    viz.clust.margin.left +
    viz.clust.dim.width +
    viz.uni_margin +
    viz.dendro_room.row;

  const r_spill_container = d3
    .select(viz.viz_svg)
    .append('g')
    .classed('right_spillover_container', true)
    .attr('transform', function () {
      return 'translate(' + tmp_left + ', 0)';
    });

  const tmp_top = viz.norm_labels.margin.top + viz.norm_labels.width.col;

  r_spill_container
    .append('rect')
    .attr('fill', viz.background_color) //!! prog_colors
    .attr('width', 10 * viz.clust.dim.width)
    .attr('height', viz.svg_dim.height + 'px')
    .attr('class', 'white_bars')
    .attr('class', 'right_spillover')
    .attr('transform', function () {
      return 'translate( 0,' + tmp_top + ')';
    });

  let x_offset = 0;
  let y_offset = viz.clust.margin.top;
  r_spill_container
    .append('g')
    .classed('row_dendro_icons_container', true)
    .attr('transform', 'translate(' + x_offset + ',' + y_offset + ')')
    .append('g')
    .classed('row_dendro_icons_group', true);

  if (cgm.config.show_dendrogram) {
    make_dendro_crop_buttons(cgm, 'row');
  }

  // hide spillover from top of row dendrogram
  x_offset = viz.clust.margin.left + viz.clust.dim.width;
  y_offset = tmp_top;

  const tmp_width = viz.dendro_room.row + viz.uni_margin;
  const tmp_height = viz.cat_room.col + viz.uni_margin;
  d3.select(viz.viz_svg)
    .append('rect')
    .attr('fill', viz.background_color)
    .attr('width', tmp_width)
    .attr('height', tmp_height)
    .attr('transform', function () {
      return 'translate(' + x_offset + ',' + y_offset + ')';
    })
    .classed('white_bars', true)
    .classed('dendro_row_spillover', true);
};
