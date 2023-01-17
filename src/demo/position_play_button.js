const d3 = require('d3');

module.exports = function position_play_button(params) {
  const clust_transform = d3
    .select(params.root + ' .clust_container')
    .attr('transform');

  const clust_x = Number(clust_transform.split('(')[1].split(',')[0]);
  const clust_y = Number(clust_transform.split(',')[1].replace(')', ''));
  const trans_x = clust_x + params.viz.clust.dim.width / 2;
  const trans_y = clust_y + params.viz.clust.dim.height / 2;

  d3.select(params.root + ' .play_button').attr('transform', function () {
    return 'translate(' + trans_x + ',' + trans_y + ')';
  });
};
