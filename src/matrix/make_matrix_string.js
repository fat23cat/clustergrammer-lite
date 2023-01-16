import make_full_name from './make_full_name.js';
import each from 'underscore/modules/each';
export default (function make_matrix_string(params) {
  const inst_matrix = params.matrix;
  // get order indexes
  const order_indexes = {};
  let inst_name;
  ['row', 'col'].forEach(function (tmp_rc) {
    let inst_rc;
    // row/col names are reversed in saved orders
    if (tmp_rc === 'row') {
      inst_rc = 'col';
    } else {
      inst_rc = 'row';
    }
    // use tmp_rc
    inst_name = params.inst_order[tmp_rc];
    // use tmp_rc
    order_indexes[inst_rc] = inst_matrix.orders[inst_name + '_' + tmp_rc];
  });
  let matrix_string = '\t';
  const row_nodes = params.network_data.row_nodes;
  const col_nodes = params.network_data.col_nodes;
  // alternate column entry
  for (let c_i = 0; c_i < order_indexes.col.length; c_i++) {
    const inst_index = order_indexes.col[c_i];
    const inst_col = col_nodes[inst_index];
    const col_name = make_full_name(params, inst_col, 'col');
    if (c_i < order_indexes.col.length - 1) {
      matrix_string = matrix_string + col_name + '\t';
    } else {
      matrix_string = matrix_string + col_name;
    }
  }
  let row_data;
  matrix_string = matrix_string + '\n';
  each(order_indexes.row, function (inst_index) {
    // row names
    row_data = inst_matrix.matrix[inst_index].row_data;
    // var row_name = inst_matrix.matrix[inst_index].name;
    const inst_row = row_nodes[inst_index];
    // var row_name = inst_row.name;
    const row_name = make_full_name(params, inst_row, 'row');
    matrix_string = matrix_string + row_name + '\t';
    // alternate data entry
    for (let r_i = 0; r_i < order_indexes.col.length; r_i++) {
      // get the order
      const col_index = order_indexes.col[r_i];
      if (r_i < order_indexes.col.length - 1) {
        matrix_string =
          matrix_string + String(row_data[col_index].value) + '\t';
      } else {
        matrix_string = matrix_string + String(row_data[col_index].value);
      }
    }
    matrix_string = matrix_string + '\n';
  });
  return matrix_string;
});
