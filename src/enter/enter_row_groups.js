import d3 from "d3";
import enter_new_rows from "./enter_new_rows.js";
export default (function enter_row_groups(params, delays, duration, tip) {
    // enter new rows
    const new_row_groups = d3
        .select(params.root + ' .clust_group')
        .selectAll('.row')
        .data(params.matrix.matrix, function (d) {
        return d.name;
    })
        .enter()
        .append('g')
        .classed('row', true)
        .attr('transform', function (d) {
        return 'translate(0,' + params.viz.y_scale(d.row_index) + ')';
    });
    new_row_groups.each(function (d) {
        enter_new_rows(params, d, delays, duration, tip, this);
    });
});
