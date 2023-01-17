const demo_text = require('./demo_text');
const two_translate_zoom = require('../zoom/two_translate_zoom');

module.exports = function play_zoom() {
  function run(cgm) {
    const params = cgm.params;
    const text = 'Zoom and pan by\nscrolling and dragging';
    demo_text(params, text, 4000);

    setTimeout(two_translate_zoom, 1500, cgm, 0, 0, 4);
  }

  function get_duration() {
    return 4000;
  }

  return {
    run: run,
    get_duration: get_duration
  };
};
