const d3 = require('d3');

module.exports = function make_row_visual_aid_triangles(params) {
  if (d3.select(params.root + ' .row_cat_group path').empty() === true) {
    d3.selectAll(params.root + ' .row_cat_group')
      .append('path')
      .attr('d', function () {
        const origin_x = params.viz.cat_room.symbol_width - 1;
        const origin_y = 0;
        const mid_x = 1;
        const mid_y = params.viz.y_scale.rangeBand() / 2;
        const final_x = params.viz.cat_room.symbol_width - 1;
        const final_y = params.viz.y_scale.rangeBand();
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
      })
      .attr('fill', '#eee')
      .style('opacity', params.viz.triangle_opacity);
  }
};
