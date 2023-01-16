const d3 = require('d3');

module.exports = function position_tree_menu(cgm) {
  const params = cgm.params;

  if (d3.select(params.root + ' .tree_menu').empty() === false) {
    const menu_width = cgm.params.viz.tree_menu_width;

    d3.select(params.root + ' .tree_menu').attr('transform', function () {
      const shift = {};
      shift.x =
        params.viz.clust.dim.width +
        params.viz.clust.margin.left -
        menu_width +
        30;
      shift.y = params.viz.clust.margin.top + 15;
      return 'translate(' + shift.x + ', ' + shift.y + ')';
    });
  }
};
