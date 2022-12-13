module.exports = function (old_params, params) {
  // exit, update, enter

  // check if exit or enter or both are required
  var old_row_nodes = old_params.network_data.row_nodes;
  var old_col_nodes = old_params.network_data.col_nodes;
  var old_row = old_row_nodes.map(function (d) {
    return d.name;
  });
  var old_col = old_col_nodes.map(function (d) {
    return d.name;
  });
  var all_old_nodes = old_row.concat(old_col);

  var row_nodes = params.network_data.row_nodes;
  var col_nodes = params.network_data.col_nodes;
  var row = row_nodes.map(function (d) {
    return d.name;
  });
  var col = col_nodes.map(function (d) {
    return d.name;
  });
  var all_nodes = row.concat(col);

  var exit_nodes = all_old_nodes.filter((x) => !all_nodes.includes(x)).length;
  var enter_nodes = all_nodes.filter((x) => !all_old_nodes.includes(x)).length;

  var delays = {};

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

  var old_num_links = old_params.network_data.links.length;
  var new_num_links = params.network_data.links.length;
  var cutoff_num_links = 0.5 * params.matrix.def_large_matrix;

  if (old_num_links > cutoff_num_links || new_num_links > cutoff_num_links) {
    delays.run_transition = false;
    delays.update = 0;
    delays.enter = 0;
  }

  return delays;
};
