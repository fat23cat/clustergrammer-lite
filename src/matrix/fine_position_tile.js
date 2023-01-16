export default (function fine_position_tile(params, d) {
    let offset_x;
    // prevent rows not in x_scale domain from causing errors
    if (d.pos_x in params.viz.x_scale.domain()) {
        offset_x = params.viz.x_scale(d.pos_x);
    }
    else {
        offset_x = 0;
    }
    const x_pos = offset_x + 0.5 * params.viz.border_width.x;
    const y_pos = 0.5 * params.viz.border_width.y;
    return 'translate(' + x_pos + ',' + y_pos + ')';
});
