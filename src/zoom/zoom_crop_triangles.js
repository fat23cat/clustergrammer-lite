const d3 = require('d3');

module.exports = function zoom_crop_triangles(params, zoom_info, inst_rc) {
  if (inst_rc === 'row') {
    // transform icons (undo zoom on triangles)
    d3.select(params.root + ' .row_dendro_icons_group')
      .selectAll('path')
      .attr('transform', function (d) {
        const inst_x = params.viz.uni_margin;
        const inst_y = d.pos_mid;
        const curr_zoom = zoom_info.zoom_y;
        const tri_dim = d3.select(this).data()[0].tri_dim;
        const inst_zoom = constrain_zoom(curr_zoom, tri_dim);
        return (
          'translate(' +
          inst_x +
          ',' +
          inst_y +
          ') ' +
          'scale(1, ' +
          1 / inst_zoom +
          ')'
        );
      });
  } else {
    // transform icons (undo zoom on triangles)
    d3.select(params.root + ' .col_dendro_icons_group')
      .selectAll('path')
      .attr('transform', function (d) {
        const inst_x = d.pos_mid;
        const inst_y = params.viz.uni_margin;
        const curr_zoom = zoom_info.zoom_x;
        const tri_dim = d3.select(this).data()[0].tri_dim;
        const inst_zoom = constrain_zoom(curr_zoom, tri_dim);
        return (
          'translate(' +
          inst_x +
          ',' +
          inst_y +
          ') ' +
          'scale(' +
          1 / inst_zoom +
          ', 1)'
        );
      });
  }

  function constrain_zoom(curr_zoom, tri_height) {
    let inst_zoom;
    const default_tri_height = 10;
    if (tri_height * curr_zoom < default_tri_height) {
      inst_zoom = 1;
    } else {
      const max_zoom = default_tri_height / tri_height;
      inst_zoom = curr_zoom / max_zoom;
    }
    return inst_zoom;
  }
};
