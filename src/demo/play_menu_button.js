const demo_text = require('./demo_text');
const sim_click = require('./sim_click');
const $ = require('jquery');
const d3 = require('d3');

module.exports = function play_menu_button() {
  function run(params) {
    const text = 'View additional controls\nby clicking the menu button';
    demo_text(params, text, 4000);

    // var inst_element = get_row_element(params, 'EGFR');

    // var group_trans = d3.select(inst_element).attr('transform');

    // var container_trans = d3.select(params.root+' .clust_container')
    //   .attr('transform')
    //   .split(',')[1].replace(')','');

    // var x_trans = params.viz.norm_labels.width.row * 0.9;

    // var row_trans = group_trans.split(',')[1].replace(')','');
    // var y_trans = String(Number(row_trans) + Number(container_trans) +
    //   params.viz.rect_height/2);

    const x_trans = Number(
      d3
        .select(params.root + ' .expand_button')
        .attr('x')
        .replace('px', '')
    );
    const y_trans = Number(
      d3
        .select(params.root + ' .expand_button')
        .attr('y')
        .replace('px', '')
    );

    const wait_click = 3000;
    const wait_real_click = 3400;
    setTimeout(sim_click, wait_click, params, 'single', x_trans, y_trans);
    setTimeout(click_menu_button, wait_real_click, params);
  }

  function get_duration() {
    return 5000;
  }

  function click_menu_button(params) {
    $(params.root + ' .expand_button').d3Click();
  }

  function get_row_element(params, inst_row) {
    const inst_element = d3
      .selectAll(params.root + ' .row_label_group')
      .filter(function () {
        const inst_data = this.__data__;
        return inst_data.name == inst_row;
      })[0][0];

    return inst_element;
  }

  // allows doubleclicking on d3 element
  $.fn.d3Click = function () {
    this.each(function (i, e) {
      const evt = document.createEvent('MouseEvents');
      evt.initMouseEvent(
        'click',
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
