import each from 'underscore/modules/each.js';
export default (function check_sim_mat(config) {
  let sim_mat = false;
  const num_rows = config.network_data.row_nodes_names.length;
  const num_cols = config.network_data.col_nodes_names.length;
  if (num_rows == num_cols) {
    // the sort here was causing errors
    const rows = config.network_data.row_nodes_names;
    const cols = config.network_data.col_nodes_names;
    sim_mat = true;
    each(rows, function (inst_row) {
      const inst_index = rows.indexOf(inst_row);
      if (inst_row !== cols[inst_index]) {
        sim_mat = false;
      }
    });
  }
  if (sim_mat) {
    config.expand_button = false;
  }
  return sim_mat;
});
