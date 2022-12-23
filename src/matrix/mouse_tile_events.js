const click_tile = require('./click_tile');

module.exports = function mouse_tile_events(element, params, context, tip) {
  var data = null;
  var position;
  return element
    .on('mouseover', function mouseover(...args) {
      mouseover_tile(params, context, tip, args);
      data = args;
    })
    .on('mouseout', function mouseout() {
      mouseout_tile(params, context, tip);
      data = null;
    })
    .on('mousedown', function mousedown() {
      position = d3.mouse(this);
    })
    .on('mouseup', function mouseup() {
      var newPosition = d3.mouse(this);
      if (position[0] == newPosition[0] || position[1] == newPosition[1]) {
        click_tile(args);
      }
    });
};
