import each from 'underscore/modules/each';
import utils from '../Utils_clust.js';
export default (function calc_row_dendro_triangles(params) {
  const triangle_info = {};
  const inst_level = params.group_level.row;
  const row_nodes = params.network_data.row_nodes || [];
  const row_nodes_names = params.network_data.row_nodes_names || [];
  each(row_nodes, function (d) {
    const tmp_group = d.group[inst_level];
    const inst_index = row_nodes_names.indexOf(d.name);
    const inst_top = params.viz.y_scale(inst_index);
    const inst_bot = inst_top + params.viz.y_scale.rangeBand();
    if (!utils.has(triangle_info, tmp_group)) {
      triangle_info[tmp_group] = {};
      triangle_info[tmp_group].name_top = d.name;
      triangle_info[tmp_group].name_bot = d.name;
      triangle_info[tmp_group].pos_top = inst_top;
      triangle_info[tmp_group].pos_bot = inst_bot;
      triangle_info[tmp_group].pos_mid = (inst_top + inst_bot) / 2;
      triangle_info[tmp_group].name = tmp_group;
      triangle_info[tmp_group].all_names = [];
      triangle_info[tmp_group].inst_rc = 'row';
    }
    triangle_info[tmp_group].all_names.push(d.name);
    if (inst_top < triangle_info[tmp_group].pos_top) {
      triangle_info[tmp_group].name_top = d.name;
      triangle_info[tmp_group].pos_top = inst_top;
      triangle_info[tmp_group].pos_mid =
        (inst_top + triangle_info[tmp_group].pos_bot) / 2;
    }
    if (inst_bot > triangle_info[tmp_group].pos_bot) {
      triangle_info[tmp_group].name_bot = d.name;
      triangle_info[tmp_group].pos_bot = inst_bot;
      triangle_info[tmp_group].pos_mid =
        (triangle_info[tmp_group].pos_top + inst_bot) / 2;
    }
  });
  const group_info = [];
  each(triangle_info, function (d) {
    group_info.push(d);
  });
  return group_info;
});
