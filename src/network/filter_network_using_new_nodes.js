import utils from '../Utils_clust.js';
import * as core from 'mathjs/core';
import matrix from 'mathjs/lib/type/matrix';
import * as zeros from 'mathjs/lib/function/matrix/zeros';
import filter from 'underscore/modules/filter.js';
const math = core.create();
math.import(matrix);
math.import(zeros);
export default (function filter_network_using_new_nodes(config, new_nodes) {
  const links = config.network_data.links;
  // // make new mat from links
  // var new_mat = config.network_data.mat;
  // get new names of rows and cols
  const row_names = utils.pluck(new_nodes.row_nodes, 'name') || [];
  const col_names = utils.pluck(new_nodes.col_nodes, 'name') || [];
  let new_mat = math.matrix(
    math.zeros([new_nodes.row_nodes.length, new_nodes.col_nodes.length])
  );
  new_mat = new_mat.toArray();
  const new_links = filter(links, function (inst_link) {
    const inst_row = inst_link.name.split('_')[0];
    const inst_col = inst_link.name.split('_')[1];
    const row_index = row_names.indexOf(inst_row);
    const col_index = col_names.indexOf(inst_col);
    // only keep links that have not been filtered out
    if ((row_index > -1) & (col_index > -1)) {
      // redefine source and target
      inst_link.source = row_index;
      inst_link.target = col_index;
      new_mat[row_index][col_index] = inst_link.value;
      return inst_link;
    }
  });
  // set up new_network_data
  const new_network_data = {};
  // rows
  new_network_data.row_nodes = new_nodes.row_nodes;
  new_network_data.row_nodes_names = row_names;
  // cols
  new_network_data.col_nodes = new_nodes.col_nodes;
  new_network_data.col_nodes_names = col_names;
  // save all links
  new_network_data.links = new_links;
  new_network_data.all_links = links;
  // mat
  new_network_data.mat = new_mat;
  // add back all views
  new_network_data.views = config.network_data.views;
  // add cat_colors if necessary
  if (utils.has(config.network_data, 'cat_colors')) {
    new_network_data.cat_colors = config.network_data.cat_colors;
  }
  return new_network_data;
});
