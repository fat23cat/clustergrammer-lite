const d3 = require('d3');
const calc_downsampled_matrix = require('../matrix/calc_downsampled_matrix');
const $ = require('jquery');

module.exports = function calc_downsampled_levels(params) {
  // console.log('---- before ---------')
  // console.log(params.matrix.matrix[0].row_data[0].value)

  // height of downsampled rectangles
  const ds_height = 3;

  // const min_rect_height = 2;

  const total_zoom = ds_height / params.viz.rect_height;

  // amount of zooming that is tolerated for the downsampled rows
  const inst_zt = 2;
  params.viz.ds_zt = inst_zt;

  const num_levels = Math.floor(Math.log(total_zoom) / Math.log(inst_zt));

  // TODO: Decide about downsampling feature
  // Here the downsampling can be turned off
  //
  // const shouldBeDownsampled =
  //   params.viz.rect_height < min_rect_height && num_levels > 0;
  const shouldBeDownsampled = false;

  if (shouldBeDownsampled) {
    // increase ds opacity, as more rows are compressed into a single downsampled
    // row, increase the opacity of the downsampled row. Max increase will be 2x
    // when 100 or more rows are compressed
    const max_opacity_scale = 2;
    params.viz.ds_opacity_scale = d3.scale
      .linear()
      .domain([1, 100])
      .range([1, max_opacity_scale])
      .clamp(true);

    params.viz.ds_num_levels = num_levels;

    // array of downsampled parameters
    params.viz.ds = [];

    // array of downsampled matrices at varying levels
    params.matrix.ds_matrix = [];

    const inst_order = params.viz.inst_order.row;

    // cloning
    const mat = $.extend(true, {}, params.matrix.matrix);

    // calculate parameters for different levels
    for (let i = 0; i < num_levels; i++) {
      // instantaneous ds_level (-1 means no downsampling)
      params.viz.ds_level = 0;

      const ds = {};

      ds.height = ds_height;
      ds.num_levels = num_levels;

      const inst_zoom_tolerance = Math.pow(inst_zt, i);

      ds.zt = inst_zoom_tolerance;

      // the number of downsampled rows is given by the height of the clustergram
      // divided by the adjusted height of the downsampled rect.
      // the adjusted height is the height divided by the zooming tolerance of
      // the downsampled layer

      // number of downsampled rows
      ds.num_rows = Math.round(
        params.viz.clust.dim.height / (ds.height / inst_zoom_tolerance)
      );

      // x_scale
      /////////////////////////
      ds.x_scale = d3.scale
        .ordinal()
        .rangeBands([0, params.viz.clust.dim.width]);

      ds.x_scale.domain(params.matrix.orders[inst_order + '_row']);

      // y_scale
      /////////////////////////
      ds.y_scale = d3.scale
        .ordinal()
        .rangeBands([0, params.viz.clust.dim.height]);
      ds.y_scale.domain(d3.range(ds.num_rows + 1));

      ds.rect_height = ds.y_scale.rangeBand() - params.viz.border_width.y;

      params.viz.ds.push(ds);

      const matrix = calc_downsampled_matrix(params, mat, i);
      params.matrix.ds_matrix.push(matrix);
    }

    // reset row viz_nodes since downsampling
    params.viz.viz_nodes.row = d3
      .range(params.matrix.ds_matrix[0].length)
      .map(String);
  } else {
    // set ds to null if no downsampling is done
    params.viz.ds = null;
    // instantaneous ds_level (-1 means no downsampling)
    params.viz.ds_level = -1;
    params.viz.ds_num_levels = 0;
  }

  // console.log('---- after ---------')
  // console.log(params.matrix.matrix[0].row_data[0].value)
};
