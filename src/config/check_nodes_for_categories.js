import each from 'underscore/modules/each';
export default (function check_nodes_for_categories(nodes) {
  const super_string = ': ';
  let has_cat = true;
  each(nodes, function (inst_node) {
    const inst_name = String(inst_node.name);
    if (inst_name.indexOf(super_string) < 0) {
      has_cat = false;
    }
  });
  return has_cat;
});
