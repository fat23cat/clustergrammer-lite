const d3 = require('d3');

module.exports = function position_tree_icon(cgm) {
  const viz = cgm.params.viz;
  let tmp_left;
  let tmp_top;

  // keep slider near clustergram
  const max_room = viz.svg_dim.width - 3 * viz.uni_margin;

  // position close to row dendrogram trapezoids
  tmp_left =
    viz.clust.margin.left + viz.clust.dim.width + 5.25 * viz.dendro_room.row;

  if (tmp_left > max_room) {
    tmp_left = max_room;
  }

  // tmp_top =  viz.clust.margin.top + 3 * viz.uni_margin - 50;
  tmp_top = viz.clust.margin.top + 3 * viz.uni_margin + 90;

  // reposition tree icon
  d3.select(cgm.params.root + ' .' + 'tree_icon')
    .attr('transform', function () {
      tmp_top = tmp_top - 75;
      return 'translate(' + tmp_left + ',' + tmp_top + ')';
    })
    .style('opacity', 1);
};
