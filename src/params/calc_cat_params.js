const d3 = require('d3');

module.exports = function calc_cat_params(params, viz) {
  let separtion_room;

  // increase the width of the label container based on the label length
  const label_scale = d3.scale
    .linear()
    .domain([5, 15])
    .range([85, 120])
    .clamp('true');

  viz.cat_room = {};
  viz.cat_room.symbol_width = 12;
  viz.cat_room.separation = 3;

  ['row', 'col'].forEach(function (inst_rc) {
    viz.norm_labels.width[inst_rc] =
      label_scale(params.labels[inst_rc + '_max_char']) *
      params[inst_rc + '_label_scale'];

    viz['num_' + inst_rc + '_nodes'] =
      params.network_data[inst_rc + '_nodes'].length;

    if (inst_rc === 'row') {
      viz.dendro_room[inst_rc] = viz.dendro_room.symbol_width;
    } else {
      viz.dendro_room[inst_rc] =
        viz.dendro_room.symbol_width + 3 * viz.uni_margin;
    }

    const num_cats = viz.all_cats[inst_rc].length;

    if (viz.show_categories[inst_rc]) {
      separtion_room = (num_cats - 1) * viz.cat_room.separation;

      let adjusted_cats;
      if (inst_rc === 'row') {
        adjusted_cats = num_cats + 1;
      } else {
        adjusted_cats = num_cats;
      }

      viz.cat_room[inst_rc] =
        adjusted_cats * viz.cat_room.symbol_width + separtion_room;
    } else {
      // no categories
      if (inst_rc == 'row') {
        viz.cat_room[inst_rc] = viz.cat_room.symbol_width;
      } else {
        viz.cat_room[inst_rc] = 0;
      }
    }
  });

  return viz;
};
