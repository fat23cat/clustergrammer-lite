import d3 from "d3";
import reset_size_after_update from "../reset_size/reset_size_after_update.js";
import make_col_label_container from "../labels/make_col_label_container.js";
import show_visible_area from "../zoom/show_visible_area.js";
import resize_containers from "../reset_size/resize_containers.js";
export default (function ds_enter_exit_update(cgm) {
    // console.log('======== ds_enter_exit_update ===============');
    // remove row labels, remove non-downsampled rows, and add downsampled rows
    d3.selectAll(cgm.params.root + ' .row_cat_group').remove();
    d3.selectAll(cgm.params.root + ' .row_label_group').remove();
    d3.selectAll(cgm.params.root + ' .row').remove();
    // no need to re-calculate the downsampled layers
    // calc_downsampled_levels(params);
    const zooming_stopped = true;
    const zooming_out = true;
    const make_all_rows = true;
    // show_visible_area is also run with two_translate_zoom, but at that point
    // the parameters were not updated and two_translate_zoom if only run
    // if needed to reset zoom
    show_visible_area(cgm, zooming_stopped, zooming_out, make_all_rows);
    make_col_label_container(cgm);
    const col_nodes = cgm.params.network_data.col_nodes;
    // remove column labels
    d3.selectAll(cgm.params.root + ' .col_label_group')
        .data(col_nodes, function (d) {
        return d.name;
    })
        .exit()
        .style('opacity', 0)
        .remove();
    d3.selectAll(cgm.params.root + ' .col_label_text')
        .data(col_nodes, function (d) {
        return d.name;
    })
        .exit()
        .style('opacity', 0)
        .remove();
    d3.selectAll(cgm.params.root + ' .col_cat_group')
        .data(col_nodes, function (d) {
        return d.name;
    })
        .exit()
        .style('opacity', 0)
        .remove();
    d3.selectAll(cgm.params.root + ' .col_dendro_group')
        .data(col_nodes, function (d) {
        return d.name;
    })
        .exit()
        .style('opacity', 0)
        .remove();
    // necessary for repositioning clust, col and col-cat containers
    resize_containers(cgm.params);
    // seeing if this fixes resizing issue
    const delays = {};
    delays.enter = 0;
    delays.update = 0;
    delays.run_transition = false;
    const duration = 0;
    reset_size_after_update(cgm, duration, delays);
});
