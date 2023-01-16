import d3 from "d3";
export default (function position_filter_icon(cgm) {
    const viz = cgm.params.viz;
    let tmp_left;
    let tmp_top;
    // keep slider near clustergram
    const max_room = viz.svg_dim.width - 3 * viz.uni_margin;
    // position close to row dendrogram trapezoids
    tmp_left =
        viz.clust.margin.left + viz.clust.dim.width + 4 * viz.dendro_room.row + 7;
    if (tmp_left > max_room) {
        tmp_left = max_room;
    }
    // tmp_top =  viz.clust.margin.top + 3 * viz.uni_margin - 50;
    tmp_top = viz.clust.margin.top + 3 * viz.uni_margin + 152;
    // reposition tree icon
    d3.select(cgm.params.root + ' .' + 'filter_icon')
        .attr('transform', function () {
        tmp_top = tmp_top - 75;
        return 'translate(' + tmp_left + ',' + tmp_top + ')';
    })
        .style('opacity', 1);
});
