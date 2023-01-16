import d3 from "d3";
import demo_text from "./demo_text.js";
import highlight_sidebar_element from "./highlight_sidebar_element.js";
import update_viz_with_view from "../network/update_viz_with_view.js";
import * as $ from "jquery";
export default (function play_filter() {
    function run(cgm) {
        const params = cgm.params;
        let text = 'Filter rows based on sum or\nvariance using the sliders';
        demo_text(params, text, 4000);
        const filter_type = 'N_row_sum';
        setTimeout(highlight_sidebar_element, 5000, params, 'slider_' + filter_type, 13000);
        text = 'Filter: Top 20 rows by sum';
        setTimeout(demo_text, 5000, params, text, 4000);
        setTimeout(run_update, 5300, cgm, filter_type, 20, 1);
        text = 'Filter: Top 10 rows by sum';
        setTimeout(demo_text, 10000, params, text, 4000);
        setTimeout(run_update, 10300, cgm, filter_type, 10, 2);
        text = 'Filter: All rows';
        setTimeout(demo_text, 15000, params, text, 4000);
        setTimeout(run_update, 15300, cgm, filter_type, 'all', 0);
    }
    function get_duration() {
        return 19500;
    }
    function run_update(cgm, filter_type, filter_value, filter_index) {
        const params = cgm.params;
        const requested_view = {};
        requested_view[filter_type] = filter_value;
        update_viz_with_view(cgm, requested_view);
        // quick fix for slider
        $(params.root + ' .slider_' + filter_type).slider('value', filter_index);
        let unit_name;
        if (filter_type === 'N_row_sum') {
            unit_name = 'sum';
        }
        else {
            unit_name = 'variance';
        }
        d3.select(params.root + ' .title_' + filter_type).text('Top rows ' + unit_name + ': ' + filter_value);
    }
    return {
        run: run,
        get_duration: get_duration
    };
});
