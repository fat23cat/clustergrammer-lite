const d3 = require('d3');
const run_segment = require('./run_segment');
const play_intro = require('./play_intro');
const play_zoom = require('./play_zoom');
const play_reset_zoom = require('./play_reset_zoom');
const play_reorder_row = require('./play_reorder_row');
const play_reorder_buttons = require('./play_reorder_buttons');
const play_search = require('./play_search');
const play_filter = require('./play_filter');
const quick_cluster = require('./quick_cluster');
const play_groups = require('./play_groups');
const play_categories = require('./play_categories');
const play_conclusion = require('./play_conclusion');
const toggle_play_button = require('./toggle_play_button');
const play_menu_button = require('./play_menu_button');
const $ = require('jquery');

module.exports = function play_demo() {
  const cgm = this;
  const params = cgm.params;

  if (d3.select(params.root + ' .running_demo').empty()) {
    // prevent more than one demo from running at once
    d3.select(params.root + ' .play_button').classed('running_demo', true);

    toggle_play_button(params, false);

    // prevent user interaction while playing
    $.blockUI({
      css: {
        border: 'none',
        padding: '15px',
        backgroundColor: '#000',
        '-webkit-border-radius': '10px',
        '-moz-border-radius': '10px',
        opacity: 0,
        color: '#fff',
        cursor: 'default'
      }
    });

    d3.selectAll('.blockUI').style('opacity', 0);

    // intro text
    let inst_time = 750;

    if (cgm.params.viz.is_expand === false) {
      inst_time = run_segment(params, inst_time, quick_cluster);
      inst_time = inst_time - 1500;
    }

    // clustergram interaction
    ///////////////////////////////////
    inst_time = run_segment(params, inst_time, play_intro);
    inst_time = run_segment(params, inst_time, play_zoom);
    inst_time = run_segment(cgm, inst_time, play_reset_zoom);
    inst_time = run_segment(params, inst_time, play_categories);
    inst_time = run_segment(params, inst_time, play_reorder_row);

    // sidebar interaction
    ///////////////////////////////////
    inst_time = run_segment(params, inst_time, play_menu_button);
    inst_time = run_segment(params, inst_time, play_groups);
    inst_time = run_segment(params, inst_time, play_reorder_buttons);
    inst_time = run_segment(params, inst_time, play_search);
    inst_time = run_segment(cgm, inst_time, play_filter);

    // conclusion
    ///////////////////////////////////
    inst_time = run_segment(params, inst_time, quick_cluster);
    run_segment(params, inst_time, play_conclusion);
  }
};
