import d3 from "d3";
export default (function check_zoom_stop_status(params) {
    const inst_zoom = Number(d3.select(params.root + ' .viz_svg').attr('is_zoom'));
    const check_stop = Number(d3.select(params.root + ' .viz_svg').attr('stopped_zoom'));
    let stop_attributes = false;
    if (inst_zoom === 0 && check_stop != 0) {
        stop_attributes = true;
    }
    return stop_attributes;
});
