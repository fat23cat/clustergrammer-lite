const d3 = require('d3');
const demo_text = require('./demo_text');
const sim_click = require('./sim_click');
const $ = require('jquery');

module.exports = function play_category() {
  function run(params) {
    const text =
      'Row and column categories\ncan be use to reorder\nby double-clicking';
    demo_text(params, text, 7000);

    const inst_element = d3
      .selectAll(params.root + ' .col_cat_super')
      .filter(function () {
        return this.__data__ === 'cat-1';
      })[0];

    const tmp_pos = d3.select('.col_cat_super').attr('transform');
    const x_trans =
      Number(tmp_pos.split('(')[1].split(',')[0].replace(')', '')) + 20;
    const y_trans = Number(tmp_pos.split(',')[1].replace(')', ''));

    const wait_click = 4000;
    setTimeout(sim_click, wait_click, params, 'double', x_trans, y_trans);

    const wait_reorder = wait_click + 300;
    setTimeout(fire_double_click_row, wait_reorder, params, inst_element);
  }

  function get_duration() {
    return 8000;
  }

  function fire_double_click_row(params, inst_element) {
    $(inst_element).d3DblClick();
  }

  // allows doubleclicking on d3 element
  $.fn.d3DblClick = function () {
    this.each(function (i, e) {
      const evt = document.createEvent('MouseEvents');
      evt.initMouseEvent(
        'dblclick',
        true,
        true,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );
      e.dispatchEvent(evt);
    });
  };
  return {
    run: run,
    get_duration: get_duration
  };
};
