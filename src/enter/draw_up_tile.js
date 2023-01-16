export default (function draw_up_tile(params) {
    const start_x = 0;
    const final_x = params.viz.x_scale.rangeBand() - params.viz.border_width.x;
    const start_y = 0;
    const final_y = params.viz.y_scale.rangeBand() - params.viz.border_width.y;
    const output_string = 'M' +
        start_x +
        ',' +
        start_y +
        ' L' +
        start_x +
        ', ' +
        final_y +
        ' L' +
        final_x +
        ',0 Z';
    return output_string;
});
