const make_play_button = require('./make_play_button');
const make_demo_text_containers = require('./make_demo_text_containers');

module.exports = function ini_demo() {
  const cgm = this;
  const params = cgm.params;

  make_play_button(cgm);

  const demo_text_size = 30;
  make_demo_text_containers(params, demo_text_size);
};
