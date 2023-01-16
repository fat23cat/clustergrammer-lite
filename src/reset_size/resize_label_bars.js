import calc_val_max from "../params/calc_val_max.js";
export default (function resize_label_bars(cgm, svg_group) {
    let params = cgm.params;
    params = calc_val_max(params);
    svg_group
        .selectAll('.row_bars')
        // .transition().delay(delays.update).duration(duration)
        .attr('width', function (d) {
        let inst_value = 0;
        inst_value = params.labels.bar_scale_row(Math.abs(d.value));
        return inst_value;
    })
        .attr('x', function (d) {
        let inst_value = 0;
        inst_value = -params.labels.bar_scale_row(Math.abs(d.value));
        return inst_value;
    })
        .attr('height', params.viz.y_scale.rangeBand());
});
