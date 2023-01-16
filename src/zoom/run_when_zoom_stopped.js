import d3 from "d3";
import constrain_font_size from "./constrain_font_size.js";
import trim_text from "./trim_text.js";
import num_visible_labels from "./num_visible_labels.js";
import toggle_grid_lines from "../matrix/toggle_grid_lines.js";
import show_visible_area from "./show_visible_area.js";
import check_zoom_stop_status from "./check_zoom_stop_status.js";
export default (function run_when_zoom_stopped(cgm) {
    const params = cgm.params;
    const stop_attributes = check_zoom_stop_status(params);
    if (stop_attributes === true) {
        // ///////////////////////////////////////////////
        // // zooming has stopped
        // ///////////////////////////////////////////////
        // console.log('\nZOOMING HAS ACTUALLY STOPPED\n============================');
        // console.log(params.zoom_info.zoom_y)
        ['row', 'col'].forEach(function (inst_rc) {
            d3.selectAll(params.root + ' .' + inst_rc + '_label_group')
                .select('text')
                .style('opacity', 1);
            d3.selectAll(params.root + ' .' + inst_rc + '_cat_group')
                .select('path')
                .style('display', 'block');
        });
        show_visible_area(cgm, true);
        d3.selectAll(params.viz.root_tips).style('display', 'block');
        d3.selectAll(params.root + ' .row_label_group')
            .select('text')
            .style('display', 'none');
        d3.selectAll(params.root + ' .row_label_group')
            .select('text')
            .style('display', 'block');
        d3.select(params.root + ' .viz_svg').attr('stopped_zoom', 0);
        d3.selectAll(params.root + ' .row_label_group')
            .select('text')
            .style('display', 'block');
        d3.selectAll(params.root + ' .col_label_group')
            .select('text')
            .style('display', 'block');
        toggle_grid_lines(params);
        // reset x_offset
        cgm.params.viz.x_offset = 0;
        const max_labels_to_trim = 150;
        // probably do not need
        /////////////////////////
        ['row', 'col'].forEach(function (inst_rc) {
            const inst_num_visible = num_visible_labels(params, inst_rc);
            if (inst_num_visible < max_labels_to_trim) {
                d3.selectAll(params.root + ' .' + inst_rc + '_label_group').each(function () {
                    trim_text(params, this, inst_rc);
                });
            }
        });
        text_patch();
        constrain_font_size(params);
        // this makes sure that the text is visible after zooming and trimming
        // there is buggy behavior in chrome when zooming into large matrices
        // I'm running it twice in quick succession
        setTimeout(text_patch, 100);
    }
    function text_patch() {
        ['row', 'col'].forEach(function (inst_rc) {
            d3.selectAll(params.root + ' .' + inst_rc + '_label_group')
                .filter(function () {
                return d3.select(this).style('display') != 'none';
            })
                .select('text')
                .style('font-size', function () {
                const inst_fs = Number(d3.select(this).style('font-size').replace('px', ''));
                return inst_fs;
            });
        });
    }
});
