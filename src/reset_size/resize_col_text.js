import d3 from "d3";
import utils from "../Utils_clust.js";
export default (function resize_col_text(params, svg_group) {
    svg_group
        .selectAll('.col_label_group')
        .select('text')
        .style('font-size', params.labels.default_fs_col + 'px')
        .text(function (d) {
        return utils.normal_name(d);
    });
    svg_group.selectAll('.col_label_group').each(function () {
        d3.select(this).select('text')[0][0].getBBox();
    });
});
