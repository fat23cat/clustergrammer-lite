// var clusterfck = require('cornhundred-clusterfck');
const clusterfck = require('../clusterfck_local/clusterfck');
const core = require('mathjs/core');
const math = core.create();
const dist_fun = require('./distance_functions');
const get_order_and_groups_clusterfck_tree = require('./get_order_and_groups_clusterfck_tree');
const update_view = require('../update/update_view');
const $ = require('jquery');
const d3 = require('d3');

math.import(require('mathjs/lib/function/matrix/transpose'));
math.import(require('mathjs/lib/type/matrix'));

module.exports = function recluster(cgm, distance_metric, linkage_type) {
  const new_view = {};
  new_view.N_row_sum = 'null';
  new_view.N_row_var = 'null';
  new_view.distance_metric = distance_metric;
  new_view.linkage_type = distance_metric;

  const view_name = distance_metric + '_' + linkage_type;

  new_view.name = view_name;

  // // constructing new nodes from old view (does not work when filtering)
  // new_view.nodes = $.extend(true, [], cgm.params.network_data.views[0].nodes);

  new_view.nodes = {};
  new_view.nodes.row_nodes = $.extend(
    true,
    [],
    cgm.params.network_data.row_nodes
  );
  new_view.nodes.col_nodes = $.extend(
    true,
    [],
    cgm.params.network_data.col_nodes
  );

  ['row', 'col'].forEach(function (inst_rc) {
    let mat;
    const transpose = math.transpose;
    let names;
    let name_nodes;

    if (inst_rc === 'row') {
      mat = $.extend(true, [], cgm.params.network_data.mat);

      names = cgm.params.network_data.row_nodes_names;
      name_nodes = 'row_nodes';
    } else if (inst_rc === 'col') {
      mat = $.extend(true, [], cgm.params.network_data.mat);
      mat = transpose(mat);

      names = cgm.params.network_data.col_nodes_names;
      name_nodes = 'col_nodes';
    }

    // average, single, complete
    const clusters = clusterfck.hcluster(
      mat,
      dist_fun[distance_metric],
      linkage_type
    );

    const order_info = get_order_and_groups_clusterfck_tree(clusters, names);
    let inst_node;
    let inst_order;

    // row or column nodes
    const rc_nodes = new_view.nodes[name_nodes];

    for (let index = 0; index < rc_nodes.length; index++) {
      inst_node = rc_nodes[index];
      inst_order = order_info.info[index];

      inst_node.clust = inst_order.order;
      inst_node.group = inst_order.group;
    }
  });

  // add new view to views
  cgm.config.network_data.views.push(new_view);

  // delay update if menu has not been removed
  if (d3.select(cgm.params.root + ' .tree_menu').empty()) {
    update_view(cgm, 'name', view_name);
  } else {
    setTimeout(update_view, 500, cgm, 'name', view_name);
  }
};
