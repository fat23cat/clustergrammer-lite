const d3 = require('d3');

module.exports = function position_filter_menu(cgm) {
  const params = cgm.params;

  if (d3.select(params.root + ' .filter_menu').empty() === false) {
    const menu_width = cgm.params.viz.filter_menu_width;

    d3.select(params.root + ' .filter_menu').attr('transform', function () {
      const shift = {};
      shift.x =
        params.viz.clust.dim.width +
        params.viz.clust.margin.left -
        menu_width +
        30;
      shift.y = params.viz.clust.margin.top + 80;
      return 'translate(' + shift.x + ', ' + shift.y + ')';
    });
  }
};
