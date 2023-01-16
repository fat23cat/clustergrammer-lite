import d3 from "d3";
export default (function disable_sidebar(params) {
    d3.selectAll(params.root + ' .btn').attr('disabled', true);
    d3.select(params.viz.viz_svg).style('opacity', 0.7);
});
