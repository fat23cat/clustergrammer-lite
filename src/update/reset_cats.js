const make_row_cat = require('../categories/make_row_cat');
const calc_viz_params = require('../params/calc_viz_params');
const resize_viz = require('../reset_size/resize_viz');
const modify_row_node_cats = require('./modify_row_node_cats');
const generate_cat_data = require('./generate_cat_data');

module.exports = function reset_cats(run_resize_viz = true) {
  // console.log('RESET CATS')

  const cgm = this;

  const cat_data = generate_cat_data(cgm);

  // do not change column category info
  const col_cat_colors = cgm.params.viz.cat_colors.col;

  modify_row_node_cats(cat_data, cgm.params.network_data.row_nodes);
  // modify the current inst copy of nodes
  modify_row_node_cats(cat_data, cgm.params.inst_nodes.row_nodes);

  cgm.params.new_row_cats = cat_data;
  cgm.params.viz.cat_colors.col = col_cat_colors;

  if (run_resize_viz) {
    // resize visualizatino
    ////////////////////////////
    // recalculate the visualization parameters using the updated network_data
    const predefine_cat_colors = true;
    cgm.params = calc_viz_params(cgm.params, predefine_cat_colors);

    make_row_cat(cgm, true);
    resize_viz(cgm);
  }
};
