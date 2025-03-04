const demo_text = require('./demo_text');
const highlight_sidebar_element = require('./highlight_sidebar_element');
const $ = require('jquery');
const d3 = require('d3');

module.exports = function play_reorder_buttons() {
  function run(params) {
    const text =
      'Reorder all rows and columns\nby clicking the reorder\n buttons';
    demo_text(params, text, 9000);

    setTimeout(highlight_sidebar_element, 3000, params, 'toggle_col_order');
    setTimeout(click_reorder_button, 3500, params, 'col', 'rank');

    setTimeout(highlight_sidebar_element, 7000, params, 'toggle_row_order');
    setTimeout(click_reorder_button, 7500, params, 'row', 'rank');
  }

  function get_duration() {
    return 11000;
  }

  function click_reorder_button(params, inst_rc, inst_order) {
    const inst_button = d3
      .selectAll('.toggle_' + inst_rc + '_order .btn')
      .filter(function () {
        return this.__data__ == inst_order;
      })[0];

    $(inst_button).click();
  }

  return {
    run: run,
    get_duration: get_duration
  };
};
