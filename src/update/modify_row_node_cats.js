import remove_node_cats from './remove_node_cats.js';
import utils from '../Utils_clust.js';
import each from 'underscore/modules/each.js';
import contains from 'underscore/modules/contains.js';
export default (function modify_row_node_cats(
  cat_data,
  inst_nodes,
  strip_names = false
) {
  // console.log('MODIFY ROW NODE CATS')
  // console.log('CAT_DATA')
  // console.log(cat_data)
  let cat_type_num = 0;
  let inst_index = 0;
  let inst_cat_title;
  let inst_cats;
  let inst_members;
  let inst_name;
  let inst_category;
  let inst_cat_name;
  let inst_full_cat;
  let inst_cat_num;
  // loop through row nodes
  //////////////////////////
  each(inst_nodes, function (inst_node) {
    inst_name = inst_node.name;
    // not sure if this is needed
    // inst_name = inst_name.toUpperCase();
    if (strip_names === true) {
      // only consider first part of inst_name
      ////////////////////////////////////////////
      // may improve this
      if (inst_name.indexOf(' ')) {
        inst_name = inst_name.split(' ')[0];
      } else if (inst_name.indexOf('_')) {
        inst_name = inst_name.split('_')[0];
      }
    }
    cat_type_num = 0;
    remove_node_cats(inst_node);
    // loop through each category type
    each(cat_data, function (inst_cat_data) {
      inst_cat_title = inst_cat_data.cat_title;
      inst_cats = inst_cat_data.cats;
      // initialize with no category
      inst_category = 'false';
      inst_index = -1;
      inst_cat_num = 0;
      // loop through each category in the category-type
      each(inst_cats, function (inst_cat) {
        inst_cat_name = inst_cat.cat_name;
        inst_members = inst_cat.members;
        // add category if node is a member
        if (contains(inst_members, inst_name)) {
          inst_category = inst_cat_name;
          inst_index = inst_cat_num;
        }
        inst_cat_num = inst_cat_num + 1;
      });
      if (utils.has(inst_cat_data, 'pval')) {
        const inst_pval = inst_cat_data.pval.toExponential();
        inst_full_cat =
          inst_cat_title +
          ': ' +
          inst_category +
          '<p> Pval ' +
          String(inst_pval) +
          '</p>';
      } else {
        if (inst_cat_title.indexOf('cat-') === -1) {
          inst_full_cat = inst_cat_title + ': ' + inst_category;
        } else {
          inst_full_cat = inst_category;
        }
      }
      inst_node['cat-' + String(cat_type_num)] = inst_full_cat;
      inst_node['cat_' + String(cat_type_num) + '_index'] = inst_index;
      cat_type_num = cat_type_num + 1;
    });
  });
});
