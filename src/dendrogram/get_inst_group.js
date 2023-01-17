module.exports = function (params, inst_rc, d) {
  let inst_level;
  let inst_nodes;

  if (inst_rc === 'col') {
    inst_level = params.group_level.col;
    inst_nodes = params.network_data.col_nodes;
  } else if (inst_rc === 'row') {
    inst_level = params.group_level.row;
    inst_nodes = params.network_data.row_nodes;
  }

  const inst_group = d.group[inst_level];
  const group_nodes_list = [];

  inst_nodes.forEach(function (node) {
    if (node.group[inst_level] === inst_group) {
      group_nodes_list.push(node.name);
    }
  });

  return group_nodes_list;
};
