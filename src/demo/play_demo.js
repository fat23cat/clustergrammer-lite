import d3 from "d3";
import run_segment from "./run_segment.js";
import play_intro from "./play_intro.js";
import play_zoom from "./play_zoom.js";
import play_reset_zoom from "./play_reset_zoom.js";
import play_reorder_row from "./play_reorder_row.js";
import play_reorder_buttons from "./play_reorder_buttons.js";
import play_search from "./play_search.js";
import play_filter from "./play_filter.js";
import quick_cluster from "./quick_cluster.js";
import play_groups from "./play_groups.js";
import play_categories from "./play_categories.js";
import play_conclusion from "./play_conclusion.js";
import toggle_play_button from "./toggle_play_button.js";
import play_menu_button from "./play_menu_button.js";
import * as $ from "jquery";
export default (function play_demo() {
    const cgm = this;
    const params = cgm.params;
    if (d3.select(params.root + ' .running_demo').empty()) {
        // prevent more than one demo from running at once
        d3.select(params.root + ' .play_button').classed('running_demo', true);
        toggle_play_button(params, false);
        // prevent user interaction while playing
        $.blockUI({
            css: {
                border: 'none',
                padding: '15px',
                backgroundColor: '#000',
                '-webkit-border-radius': '10px',
                '-moz-border-radius': '10px',
                opacity: 0,
                color: '#fff',
                cursor: 'default'
            }
        });
        d3.selectAll('.blockUI').style('opacity', 0);
        // intro text
        let inst_time = 750;
        if (cgm.params.viz.is_expand === false) {
            inst_time = run_segment(params, inst_time, quick_cluster);
            inst_time = inst_time - 1500;
        }
        // clustergram interaction
        ///////////////////////////////////
        inst_time = run_segment(params, inst_time, play_intro);
        inst_time = run_segment(params, inst_time, play_zoom);
        inst_time = run_segment(cgm, inst_time, play_reset_zoom);
        inst_time = run_segment(params, inst_time, play_categories);
        inst_time = run_segment(params, inst_time, play_reorder_row);
        // sidebar interaction
        ///////////////////////////////////
        inst_time = run_segment(params, inst_time, play_menu_button);
        inst_time = run_segment(params, inst_time, play_groups);
        inst_time = run_segment(params, inst_time, play_reorder_buttons);
        inst_time = run_segment(params, inst_time, play_search);
        inst_time = run_segment(cgm, inst_time, play_filter);
        // conclusion
        ///////////////////////////////////
        inst_time = run_segment(params, inst_time, quick_cluster);
        run_segment(params, inst_time, play_conclusion);
    }
});
