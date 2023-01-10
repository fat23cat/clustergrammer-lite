var filter_network_using_new_nodes = require('./filter_network_using_new_nodes');
var update_viz_with_network = require('../update/update_viz_with_network');
var utils = require('../Utils_clust');

module.exports = function filter_viz_using_names(names, external_cgm = false) {
  // names is an object with row and column names that will be used to filter
  // the matrix

  var cgm;
  if (external_cgm === false) {
    cgm = this;
  } else {
    cgm = external_cgm;
  }

  var config = cgm.config;
  var new_nodes = {};
  var found_nodes;

  ['row', 'col'].forEach(function (inst_rc) {
    var orig_nodes = JSON.parse(
      JSON.stringify(config.network_data[inst_rc + '_nodes'])
    );
    if (utils.has(names, inst_rc)) {
      if (names[inst_rc].length > 0) {
        var inst_names = names[inst_rc];
        found_nodes = (orig_nodes || []).filter((d) =>
          (inst_names || []).some((name) =>
            d.name.toLowerCase().includes(name.toLowerCase())
          )
        );
      } else {
        found_nodes = orig_nodes;
      }
    } else {
      found_nodes = orig_nodes;
    }

    new_nodes[inst_rc + '_nodes'] = found_nodes;
  });

  // keep backup of the nodes for resetting filtering
  var inst_row_nodes = cgm.params.network_data.row_nodes;
  var inst_col_nodes = cgm.params.network_data.col_nodes;

  var new_network_data = filter_network_using_new_nodes(cgm.config, new_nodes);

  // takes entire cgm object
  // last argument tells it to not preserve categoty colors
  update_viz_with_network(cgm, new_network_data);

  // only keep backup if previous number of nodes were larger than current number
  // of nodes
  if (inst_row_nodes.length > cgm.params.inst_nodes.row_nodes.length) {
    cgm.params.inst_nodes.row_nodes = inst_row_nodes;
  }

  if (inst_col_nodes.length > cgm.params.inst_nodes.col_nodes.length) {
    cgm.params.inst_nodes.col_nodes = inst_col_nodes;
  }
};
