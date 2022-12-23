var mouseover_tile = require('../matrix/mouseover_tile');
var mouseout_tile = require('../matrix/mouseout_tile');
var fine_position_tile = require('../matrix/fine_position_tile');
var click_tile = require('../matrix/click_tile');
const mouse_tile_events = require('../matrix/mouse_tile_events');

module.exports = function enter_existing_row(
  params,
  delays,
  duration,
  cur_row_tiles,
  tip
) {
  // enter new tiles
  var new_tiles = cur_row_tiles
    .enter()
    .append('rect')
    .attr('class', 'tile row_tile')
    .attr('width', params.viz.rect_width)
    .attr('height', params.viz.rect_height)
    // .on('mouseover', function (...args) {
    //   mouseover_tile(params, this, tip, args);
    // })
    // .on('mouseout', function mouseout() {
    //   mouseout_tile(params, this, tip);
    // })
    // .on('click', function (...args) {
    //   click_tile(args);
    // })
    .attr('fill-opacity', 0)
    .attr('transform', function (d) {
      return fine_position_tile(params, d);
    });

  var new_tiles_with_events = mouse_tile_events(new_tiles, params, this, tip);

  if (delays.run_transition) {
    new_tiles_with_events
      .transition()
      .delay(delays.enter)
      .duration(duration)
      .style('fill', function (d) {
        return d.value > 0
          ? params.matrix.tile_colors[0]
          : params.matrix.tile_colors[1];
      })
      .attr('fill-opacity', function (d) {
        var output_opacity = params.matrix.opacity_scale(Math.abs(d.value));
        return output_opacity;
      });
  } else {
    new_tiles_with_events
      .style('fill', function (d) {
        return d.value > 0
          ? params.matrix.tile_colors[0]
          : params.matrix.tile_colors[1];
      })
      .attr('fill-opacity', function (d) {
        var output_opacity = params.matrix.opacity_scale(Math.abs(d.value));
        return output_opacity;
      });
  }

  // remove new tiles if necessary
  new_tiles_with_events.each(function (d) {
    if (Math.abs(d.value_up) > 0 && Math.abs(d.value_dn) > 0) {
      d3.select(this).remove();
    }
  });
};
