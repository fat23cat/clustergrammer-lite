const demo_text = require('./demo_text');

module.exports = function play_intro() {
  const speed_up = 1;

  function run(params) {
    const text_1 =
      'Clustergrammer allows users to generate\ninteractive and ' +
      'sharable visualizations\nby uploading a matrix';
    const text_2 =
      "This demo will quickly overview some\nof Clustergrammer's " +
      'interactive features';

    setTimeout(demo_text, 0, params, text_1, 4500 / speed_up);
    setTimeout(demo_text, 4500 / speed_up, params, text_2, 4500 / speed_up);
  }

  function get_duration() {
    return 10000 / speed_up;
  }

  return {
    run: run,
    get_duration: get_duration
  };
};
