import make_row_cat from "../categories/make_row_cat.js";
import calc_viz_params from "../params/calc_viz_params.js";
import resize_viz from "../reset_size/resize_viz.js";
import modify_row_node_cats from "./modify_row_node_cats.js";
import generate_cat_data from "./generate_cat_data.js";
export default (function reset_cats(run_resize_viz = true) {
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
});
