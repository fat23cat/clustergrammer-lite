const sim_click = require('./sim_click');
const $ = require('jquery');
const d3 = require('d3');

module.exports = function quick_cluster() {
  function run(params) {
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

    const wait_click = 0;
    const wait_real_click = 400;
    setTimeout(sim_click, wait_click, params, 'single', x_trans, y_trans);
    setTimeout(click_menu_button, wait_real_click, params);

    setTimeout(reset_cluster_order, 1500, params);
  }

  function get_duration() {
    return 3500;
  }

  function click_menu_button(params) {
    $(params.root + ' .expand_button').d3Click();
  }

  function reset_cluster_order(params) {
    click_reorder_button(params, 'row', 'clust');
    click_reorder_button(params, 'col', 'clust');
  }

  function click_reorder_button(params, inst_rc, inst_order) {
    const inst_button = d3
      .selectAll('.toggle_' + inst_rc + '_order .btn')
      .filter(function () {
        return this.__data__ == inst_order;
      })[0];

    $(inst_button).click();
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

  return {
    run: run,
    get_duration: get_duration
  };
};
