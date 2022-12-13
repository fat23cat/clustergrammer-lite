module.exports = function remove_node_cats(inst_node) {
  Object.keys(inst_node || {}).forEach(all_props, function (inst_prop) {
    if (inst_prop.indexOf("cat-") > -1) {
      delete inst_node[inst_prop];
    }

    if (inst_prop.indexOf("cat_") > -1) {
      delete inst_node[inst_prop];
    }
  });
};
