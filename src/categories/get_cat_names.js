const d3 = require('d3');
const utils = require('../Utils_clust');
const filter = require('underscore/cjs/each');

module.exports = function get_cat_names(
  params,
  inst_data,
  inst_selection,
  inst_rc
) {
  // category index
  const inst_cat = d3.select(inst_selection).attr('cat');
  const cat_name = inst_data[inst_cat];
  const tmp_nodes = params.network_data[inst_rc + '_nodes'];

  const found_nodes = filter(tmp_nodes, function (d) {
    return d[inst_cat] == cat_name;
  });

  const found_names = utils.pluck(found_nodes, 'name');

  return found_names;
};
