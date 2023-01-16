import d3 from "d3";
import utils from "../Utils_clust.js";
export default (function resize_label_val_bars(params) {
    const zoom_info = params.zoom_info;
    // resize label bars if necessary
    if (utils.has(params.network_data.row_nodes[0], 'value')) {
        d3.selectAll(params.root + ' .row_bars')
            .attr('width', function (d) {
            let inst_value = 0;
            inst_value =
                params.labels.bar_scale_row(Math.abs(d.value)) / zoom_info.zoom_y;
            return inst_value;
        })
            .attr('x', function (d) {
            let inst_value = 0;
            inst_value =
                -params.labels.bar_scale_row(Math.abs(d.value)) / zoom_info.zoom_y;
            return inst_value;
        });
    }
    if (utils.has(params.network_data.col_nodes[0], 'value')) {
        d3.selectAll(params.root + ' .col_bars').attr('width', function (d) {
            let inst_value = 0;
            if (d.value > 0) {
                inst_value = params.labels.bar_scale_col(d.value) / zoom_info.zoom_x;
            }
            return inst_value;
        });
    }
});
