const demo_text = require('./demo_text');
const two_translate_zoom = require('../zoom/two_translate_zoom');
const sim_click = require('./sim_click');

module.exports = function play_reset_zoom() {
  function run(cgm) {
    const params = cgm.params;

    const text = 'Reset zoom by double-clicking\n';
    demo_text(params, text, 4000);

    setTimeout(sim_click, 2000, params, 'double', 300, 300);
    setTimeout(two_translate_zoom, 2400, cgm, 0, 0, 1);
  }

  function get_duration() {
    return 4500;
  }

  return {
    run: run,
    get_duration: get_duration
  };
};
