import d3 from "d3";
import mouseover_tile from "../matrix/mouseover_tile.js";
import mouseout_tile from "../matrix/mouseout_tile.js";
import fine_position_tile from "../matrix/fine_position_tile.js";
export default (function enter_existing_row(params, delays, duration, cur_row_tiles, tip) {
    // enter new tiles
    const new_tiles = cur_row_tiles
        .enter()
        .append('rect')
        .attr('class', 'tile row_tile')
        .attr('width', params.viz.rect_width)
        .attr('height', params.viz.rect_height)
        .on('mouseover', function (...args) {
        mouseover_tile(params, this, tip, args);
    })
        .on('mouseout', function mouseout() {
        mouseout_tile(params, this, tip);
    })
        .attr('fill-opacity', 0)
        .attr('transform', function (d) {
        return fine_position_tile(params, d);
    });
    if (delays.run_transition) {
        new_tiles
            .transition()
            .delay(delays.enter)
            .duration(duration)
            .style('fill', function (d) {
            return d.value > 0
                ? params.matrix.tile_colors[0]
                : params.matrix.tile_colors[1];
        })
            .attr('fill-opacity', function (d) {
            const output_opacity = params.matrix.opacity_scale(Math.abs(d.value));
            return output_opacity;
        });
    }
    else {
        new_tiles
            .style('fill', function (d) {
            return d.value > 0
                ? params.matrix.tile_colors[0]
                : params.matrix.tile_colors[1];
        })
            .attr('fill-opacity', function (d) {
            const output_opacity = params.matrix.opacity_scale(Math.abs(d.value));
            return output_opacity;
        });
    }
    // remove new tiles if necessary
    new_tiles.each(function (d) {
        if (Math.abs(d.value_up) > 0 && Math.abs(d.value_dn) > 0) {
            d3.select(this).remove();
        }
    });
});
