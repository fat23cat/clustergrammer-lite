export default (function col_viz_aid_triangle(params) {
    // x and y are flipped since its rotated
    const reduce_rect_width = params.viz.x_scale.rangeBand() * 0.36;
    const origin_y = -params.viz.border_width.x;
    const start_x = 0;
    const final_x = params.viz.x_scale.rangeBand() - reduce_rect_width;
    const start_y = -(params.viz.x_scale.rangeBand() -
        reduce_rect_width +
        params.viz.border_width.x);
    const final_y = -params.viz.border_width.x;
    const output_string = 'M ' +
        origin_y +
        ',0 L ' +
        start_y +
        ',' +
        start_x +
        ' L ' +
        final_y +
        ',' +
        final_x +
        ' Z';
    return output_string;
});
