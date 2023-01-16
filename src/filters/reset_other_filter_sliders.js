import d3 from "d3";
import make_filter_title from "./make_filter_title.js";
export default (function reset_other_filter_sliders(cgm, filter_type, inst_state) {
    const params = cgm.params;
    let inst_rc;
    let reset_rc;
    d3.select(params.root + ' .slider_' + filter_type).attr('current_state', inst_state);
    Object.keys(params.viz.possible_filters || {}).forEach(function (reset_filter) {
        if (filter_type.indexOf('row') > -1) {
            inst_rc = 'row';
        }
        else if (filter_type.indexOf('col') > -1) {
            inst_rc = 'col';
        }
        else {
            inst_rc = 'neither';
        }
        if (reset_filter.indexOf('row') > -1) {
            reset_rc = 'row';
        }
        else if (reset_filter.indexOf('col') > -1) {
            reset_rc = 'col';
        }
        else {
            reset_rc = 'neither';
        }
        if (filter_type != reset_filter && inst_rc != 'neither') {
            if (inst_rc == reset_rc) {
                const tmp_title = make_filter_title(params, reset_filter);
                cgm.slider_functions[reset_filter].value(0);
                d3.select(params.root + ' .title_' + reset_filter).text(tmp_title.text + tmp_title.state);
                d3.select(params.root + ' .slider_' + reset_filter).attr('current_state', tmp_title.state);
            }
        }
    });
    const filter_title = make_filter_title(params, filter_type);
    d3.select(params.root + ' .title_' + filter_type).text(filter_title.text + inst_state + filter_title.suffix);
});
