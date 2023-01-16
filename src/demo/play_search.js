import demo_text from "./demo_text.js";
import highlight_sidebar_element from "./highlight_sidebar_element.js";
import two_translate_zoom from "../zoom/two_translate_zoom.js";
import * as $ from "jquery";
export default (function play_search() {
    function run(cgm) {
        const params = cgm.params;
        const text = 'Search for rows using\nthe search box';
        demo_text(params, text, 5000);
        const ini_delay = 2500;
        setTimeout(highlight_sidebar_element, ini_delay, params, 'gene_search_container');
        // manually mimic typing and autocomplete
        setTimeout(type_out_search, ini_delay + 1000, params, 'E');
        setTimeout(type_out_search, ini_delay + 1500, params, 'EG');
        setTimeout(type_out_search, ini_delay + 2000, params, 'EGF');
        setTimeout(type_out_search, ini_delay + 2500, params, 'EGFR');
        setTimeout(run_search, 5500, params);
        setTimeout(two_translate_zoom, 7500, cgm, 0, 0, 1);
    }
    function get_duration() {
        return 10000;
    }
    function type_out_search(params, inst_string) {
        $(params.root + ' .gene_search_box').val(inst_string);
        $(params.root + ' .gene_search_box').autocomplete('search', inst_string);
    }
    function run_search(params) {
        $(params.root + ' .submit_gene_button').click();
        $(params.root + ' .gene_search_box').autocomplete('search', '');
    }
    return {
        run: run,
        get_duration: get_duration
    };
});
