import d3 from "d3";
export default (function grid_lines_viz(params, duration = 0) {
    let delay = 0;
    if (duration > 0) {
        delay = 2000;
    }
    const horz_lines = d3.selectAll(params.root + ' .horz_lines');
    const vert_lines = d3.selectAll(params.root + ' .vert_lines');
    horz_lines
        .style('opacity', 0)
        .attr('transform', function (d) {
        const inst_index = d.row_index;
        const inst_trans = params.viz.y_scale(inst_index);
        return 'translate(  0,' + inst_trans + ') rotate(0)';
    })
        .transition()
        .duration(duration)
        .delay(delay)
        .style('opacity', 1);
    horz_lines
        .append('line')
        .attr('x1', 0)
        .attr('x2', params.viz.clust.dim.width)
        .style('stroke-width', function () {
        const inst_width = params.viz.border_width.y;
        return inst_width + 'px';
    });
    vert_lines
        .style('opacity', 0)
        .attr('transform', function (d) {
        const inst_index = d.col_index;
        const inst_trans = params.viz.x_scale(inst_index);
        return 'translate(' + inst_trans + ') rotate(-90)';
    })
        .transition()
        .duration(duration)
        .delay(delay)
        .style('opacity', 1);
    vert_lines
        .append('line')
        .attr('x1', 0)
        .attr('x2', -params.viz.clust.dim.height)
        .style('stroke-width', function () {
        const inst_width = params.viz.border_width.x;
        return inst_width + 'px';
    });
});
