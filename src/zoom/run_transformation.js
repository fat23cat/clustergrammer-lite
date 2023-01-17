const d3 = require('d3');
const constrain_font_size = require('./constrain_font_size');
const show_visible_area = require('./show_visible_area');
const resize_label_val_bars = require('./resize_label_val_bars');
const zoom_crop_triangles = require('./zoom_crop_triangles');
const get_previous_zoom = require('./get_previous_zoom');
const run_when_zoom_stopped = require('./run_when_zoom_stopped');
const check_zoom_stop_status = require('./check_zoom_stop_status');

module.exports = function run_transformation(cgm) {
  const params = cgm.params;

  const zoom_info = params.zoom_info;

  const prev_zoom = get_previous_zoom(params);

  d3.select(params.root + ' .clust_group').attr(
    'transform',
    'translate(' +
      [zoom_info.trans_x, zoom_info.trans_y] +
      ') scale(' +
      zoom_info.zoom_x +
      ',' +
      zoom_info.zoom_y +
      ')'
  );

  d3.select(params.root + ' .row_label_zoom_container').attr(
    'transform',
    'translate(' + [0, zoom_info.trans_y] + ') scale(' + zoom_info.zoom_y + ')'
  );

  d3.select(params.root + ' .col_zoom_container').attr(
    'transform',
    'translate(' + [zoom_info.trans_x, 0] + ') scale(' + zoom_info.zoom_x + ')'
  );

  d3.select(params.root + ' .row_cat_container').attr(
    'transform',
    'translate(' +
      [0, zoom_info.trans_y] +
      ') scale( 1,' +
      zoom_info.zoom_y +
      ')'
  );

  d3.select(params.root + ' .row_dendro_container').attr(
    'transform',
    'translate(' +
      [params.viz.uni_margin / 2, zoom_info.trans_y] +
      ') ' +
      'scale( 1,' +
      zoom_info.zoom_y +
      ')'
  );

  d3.select(params.root + ' .row_dendro_icons_group').attr(
    'transform',
    function () {
      const inst_y = zoom_info.trans_y;
      const inst_translate = 'translate(' + [0, inst_y] + ') ';
      const inst_zoom = 'scale(1, ' + zoom_info.zoom_y + ')';
      const transform_string = inst_translate + inst_zoom;
      return transform_string;
    }
  );

  d3.select(params.root + ' .col_dendro_icons_group').attr(
    'transform',
    function () {
      const inst_x = zoom_info.trans_x;
      const inst_translate = 'translate(' + [inst_x, 0] + ')';
      const inst_zoom = 'scale(' + zoom_info.zoom_x + ', 1)';
      const transform_string = inst_translate + inst_zoom;
      return transform_string;
    }
  );

  zoom_crop_triangles(params, zoom_info, 'row');
  zoom_crop_triangles(params, zoom_info, 'col');

  d3.select(params.root + ' .col_cat_container').attr(
    'transform',
    'translate(' +
      [zoom_info.trans_x, 0] +
      ') scale(' +
      zoom_info.zoom_x +
      ',1)'
  );

  d3.select(params.root + ' .col_dendro_container').attr(
    'transform',
    'translate(' +
      [zoom_info.trans_x, params.viz.uni_margin / 2] +
      ') scale(' +
      zoom_info.zoom_x +
      ',1)'
  );

  resize_label_val_bars(params, zoom_info);

  d3.select(params.root + ' .viz_svg').attr('is_zoom', function () {
    const inst_zoom = Number(
      d3.select(params.root + ' .viz_svg').attr('is_zoom')
    );
    d3.select(params.root + ' .viz_svg').attr('stopped_zoom', 1);
    return inst_zoom + 1;
  });

  // this function runs with a slight delay and tells the visualization that
  // this particular zoom event is over, reducing the total number of zoom
  // events that need to finish
  const not_zooming = function () {
    d3.select(params.root + ' .viz_svg').attr('is_zoom', function () {
      const inst_zoom = Number(
        d3.select(params.root + ' .viz_svg').attr('is_zoom')
      );
      return inst_zoom - 1;
    });
  };

  constrain_font_size(params);

  if (zoom_info.zoom_y <= prev_zoom.zoom_y) {
    let zooming_out = false;
    if (zoom_info.zoom_y < prev_zoom.zoom_y) {
      zooming_out = true;
    }

    // zooming has not stopped and zooming out is true
    const zooming_stopped = false;
    show_visible_area(cgm, zooming_stopped, zooming_out);
  }

  setTimeout(not_zooming, 50);
  setTimeout(check_if_zooming_has_stopped, 100, cgm);

  function check_if_zooming_has_stopped(cgm) {
    const params = cgm.params;

    const stop_attributes = check_zoom_stop_status(params);

    if (stop_attributes === true) {
      // wait and double check that zooming has stopped
      setTimeout(run_when_zoom_stopped, 50, cgm);
    }
  }
};
