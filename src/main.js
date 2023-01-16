const make_config = require('./make_config');
const make_params = require('./params/make_params');
const make_viz = require('./make_viz');
const resize_viz = require('./reset_size/resize_viz');
const play_demo = require('./demo/play_demo');
const ini_demo = require('./demo/ini_demo');
const filter_viz_using_nodes = require('./network/filter_viz_using_nodes');
const filter_viz_using_names = require('./network/filter_viz_using_names');
const update_cats = require('./update/update_cats');
const reset_cats = require('./update/reset_cats');
const two_translate_zoom = require('./zoom/two_translate_zoom');
const update_view = require('./update/update_view');
const save_matrix = require('./matrix/save_matrix');
const brush_crop_matrix = require('./matrix/brush_crop_matrix');
const run_zoom = require('./zoom/run_zoom');
const d3_tip_custom = require('./tooltip/d3_tip_custom');
const all_reorder = require('./reorder/all_reorder');
const make_matrix_string = require('./matrix/make_matrix_string');
const run_row_search = require('./search/run_row_search');
const d3 = require('d3');

// moved d3.slider to src
d3.slider = require('./d3.slider');

class Clustergrammer {
  params;
  config;

  constructor(args) {
    this.config = make_config(args);
    this.params = make_params(this.config);

    // set up zoom
    this.params.zoom_behavior = d3.behavior
      .zoom()
      .scaleExtent([
        1,
        this.params.viz.square_zoom * this.params.viz.zoom_ratio.x
      ])
      .on('zoom', () => {
        run_zoom(this);
      });

    this.params.zoom_behavior.translate([
      this.params.viz.clust.margin.left,
      this.params.viz.clust.margin.top
    ]);

    make_viz(this);
  }

  resize_viz() {
    d3.select(this.params.viz.viz_svg).style('opacity', 0.5);

    let wait_time = 500;
    if (this.params.viz.run_trans === true) {
      wait_time = 2500;
    }

    setTimeout(resize_viz, wait_time, this);
  }

  update_cats(cat_data) {
    update_cats(this, cat_data);
  }

  zoom(pan_dx, pan_dy, fin_zoom) {
    two_translate_zoom(this, pan_dx, pan_dy, fin_zoom);
  }

  d3_tip_custom() {
    // this allows external modules to have access to d3_tip
    return d3_tip_custom;
  }

  reorder(inst_rc, inst_order) {
    if (inst_order === 'sum') {
      inst_order = 'rank';
    }
    if (inst_order === 'var') {
      inst_order = 'rankvar';
    }
    all_reorder(this, inst_order, inst_rc);
  }

  export_matrix_string() {
    return make_matrix_string(this.params);
  }

  update_view(filter_type, inst_state) {
    update_view(this, filter_type, inst_state);
  }

  search_row(search_term) {
    const entities = this.params.network_data.row_nodes_names;
    run_row_search(this, search_term, entities);
  }
}

Clustergrammer.prototype.play_demo = play_demo;
Clustergrammer.prototype.ini_demo = ini_demo;
Clustergrammer.prototype.filter_viz_using_nodes = filter_viz_using_nodes;
Clustergrammer.prototype.filter_viz_using_names = filter_viz_using_names;
Clustergrammer.prototype.reset_cats = reset_cats;
Clustergrammer.prototype.save_matrix = save_matrix;
Clustergrammer.prototype.brush_crop_matrix = brush_crop_matrix;

module.exports = Clustergrammer;
