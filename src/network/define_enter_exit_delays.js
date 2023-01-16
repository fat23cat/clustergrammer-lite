const map = require('underscore/cjs/map');
const difference = require('underscore/cjs/difference');

module.exports = function (old_params, params) {
  // exit, update, enter

  // check if exit or enter or both are required
  const old_row_nodes = old_params.network_data.row_nodes;
  const old_col_nodes = old_params.network_data.col_nodes;
  const old_row = map(old_row_nodes, function (d) {
    return d.name;
  });
  const old_col = map(old_col_nodes, function (d) {
    return d.name;
  });
  const all_old_nodes = old_row.concat(old_col);

  var row_nodes = params.network_data.row_nodes;
  var col_nodes = params.network_data.col_nodes;
  const row = map(row_nodes, function (d) {
    return d.name;
  });
  const col = map(col_nodes, function (d) {
    return d.name;
  });
  const all_nodes = row.concat(col);

  const exit_nodes = difference(all_old_nodes, all_nodes).length;
  const enter_nodes = difference(all_nodes, all_old_nodes).length;

  const delays = {};

  if (exit_nodes > 0) {
    delays.update = 1000;
  } else {
    delays.update = 0;
  }

  if (enter_nodes > 0) {
    delays.enter = 1000;
  } else {
    delays.enter = 0;
  }

  delays.enter = delays.enter + delays.update;

  delays.run_transition = true;

  const old_num_links = old_params.network_data.links.length;
  const new_num_links = params.network_data.links.length;
  const cutoff_num_links = 0.5 * params.matrix.def_large_matrix;

  if (old_num_links > cutoff_num_links || new_num_links > cutoff_num_links) {
    delays.run_transition = false;
    delays.update = 0;
    delays.enter = 0;
  }

  return delays;
};
