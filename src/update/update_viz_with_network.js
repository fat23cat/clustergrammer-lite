import make_params from "../params/make_params.js";
import define_enter_exit_delays from "../network/define_enter_exit_delays.js";
import enter_exit_update from "../enter/enter_exit_update.js";
import initialize_resizing from "../initialize_resizing.js";
import make_col_cat from "../categories/make_col_cat.js";
import make_row_cat from "../categories/make_row_cat.js";
import make_row_dendro from "../dendrogram/make_row_dendro.js";
import make_col_dendro from "../dendrogram/make_col_dendro.js";
import enable_sidebar from "../sidebar/enable_sidebar.js";
import ini_doubleclick from "../zoom/ini_doubleclick.js";
import update_reorder_buttons from "../reorder/update_reorder_buttons.js";
import make_row_cat_super_labels from "../labels/make_row_cat_super_labels.js";
import modify_row_node_cats from "./modify_row_node_cats.js";
import run_zoom from "../zoom/run_zoom.js";
import ds_enter_exit_update from "../enter/ds_enter_exit_update.js";
import make_cat_params from "../params/make_cat_params.js";
import * as $ from "jquery";
import d3 from "d3";
export default (function update_viz_with_network(cgm, new_network_data) {
    // set runnning_update class, prevents multiple update from running at once
    d3.select(cgm.params.viz.viz_svg).classed('running_update', true);
    // remove downsampled rows always
    d3.selectAll(cgm.params.root + ' .ds' + String(cgm.params.viz.ds_level) + '_row').remove();
    // run optional callback function
    if (cgm.params.matrix_update_callback != null) {
        cgm.params.matrix_update_callback();
    }
    // copy persistent parameters
    const inst_distance_metric = cgm.params.matrix.distance_metric;
    const inst_linkage_type = cgm.params.matrix.linkage_type;
    const inst_filter_state = cgm.params.matrix.filter_state;
    const inst_normalization_state = cgm.params.matrix.normalization_state;
    const inst_group_level = cgm.params.group_level;
    const inst_crop_fitler = cgm.params.crop_filter_nodes;
    // make tmp config to make new params
    const tmp_config = $.extend(true, {}, cgm.config);
    let new_row_cats = null;
    // bring in 'new' category data
    if (cgm.params.new_row_cats != null) {
        modify_row_node_cats(cgm.params.new_row_cats, new_network_data.row_nodes);
        new_row_cats = cgm.params.new_row_cats;
        cgm.params.new_row_cats = new_row_cats;
        // do not preserve the updated (row) cats
        const predefined_cat_colors = true;
        cgm.params.viz = make_cat_params(cgm.params, cgm.params.viz, predefined_cat_colors);
    }
    tmp_config.network_data = new_network_data;
    tmp_config.inst_order = cgm.params.viz.inst_order;
    tmp_config.input_domain = cgm.params.matrix.opacity_scale.domain()[1];
    update_reorder_buttons(tmp_config, cgm.params);
    // tmp_config.ini_expand = false;
    tmp_config.ini_view = null;
    tmp_config.current_col_cat = cgm.params.current_col_cat;
    // disabled, causing problems when cropping
    // always preserve category colors when updating
    tmp_config.cat_colors = cgm.params.viz.cat_colors;
    const new_params = make_params(tmp_config);
    // this function is sensitive to further updates, so run here
    const delays = define_enter_exit_delays(cgm.params, new_params);
    // pass the newly calcluated params back to the cgm object
    cgm.params = new_params;
    // set up zoom
    cgm.params.zoom_behavior = d3.behavior
        .zoom()
        .scaleExtent([1, cgm.params.viz.square_zoom * cgm.params.viz.zoom_ratio.x])
        .on('zoom', function () {
        run_zoom(cgm);
    });
    // Persistent Parameters
    /////////////////////////
    cgm.params.matrix.distance_metric = inst_distance_metric;
    cgm.params.matrix.linkage_type = inst_linkage_type;
    cgm.params.matrix.filter_state = inst_filter_state;
    cgm.params.matrix.normalization_state = inst_normalization_state;
    // have persistent group levels while updating
    cgm.params.group_level = inst_group_level;
    // have persistent crop_filter_nodes while updating
    cgm.params.crop_filter_nodes = inst_crop_fitler;
    // only run enter-exit-updates if there is no downsampling
    if (cgm.params.viz.ds_num_levels === 0) {
        // new_network_data is necessary
        enter_exit_update(cgm, new_network_data, delays);
    }
    else {
        ds_enter_exit_update(cgm);
    }
    // reduce opacity during update
    d3.select(cgm.params.viz.viz_svg).style('opacity', 0.7);
    make_row_cat(cgm);
    make_row_cat_super_labels(cgm);
    if (cgm.params.viz.show_categories.col) {
        make_col_cat(cgm);
    }
    make_row_dendro(cgm);
    make_col_dendro(cgm);
    initialize_resizing(cgm);
    d3.select(cgm.params.viz.viz_svg).call(cgm.params.zoom_behavior);
    ini_doubleclick(cgm);
    // customization
    // ini_sidebar(cgm);
    cgm.params.viz.run_trans = true;
    // d3.selectAll(cgm.params.viz.root_tips)
    //   .style('opacity',0);
    setTimeout(enable_sidebar, 2500, cgm.params);
    // remove all dendro shadows
    setTimeout(remove_shadows, 50);
    setTimeout(remove_shadows, 100);
    setTimeout(remove_shadows, 500);
    setTimeout(remove_shadows, 1000);
    setTimeout(remove_shadows, 1500);
    function remove_shadows() {
        d3.selectAll('.dendro_shadow').remove();
    }
    function finish_update() {
        d3.select(cgm.params.viz.viz_svg)
            .transition()
            .duration(250)
            .style('opacity', 1.0);
        setTimeout(finish_update_class, 1000);
    }
    setTimeout(finish_update, delays.enter);
    function finish_update_class() {
        d3.select(cgm.params.viz.viz_svg).classed('running_update', false);
    }
});
