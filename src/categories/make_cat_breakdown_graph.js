import d3 from 'd3';
import calc_cat_cluster_breakdown from './calc_cat_cluster_breakdown.js';
import each from 'underscore/modules/each';
import cat_breakdown_bars from './cat_breakdown_bars.js';
import cat_breakdown_values from './cat_breakdown_values.js';
export default (function make_cat_breakdown_graph(
  params,
  inst_rc,
  inst_data,
  dendro_info,
  selector,
  tooltip = false
) {
  /*
    This function is used to make the category breakdown graphs for tooltips on
    dendrogram mousover and on dendrogram click modal popup.
    */
  // in case sim_mat
  if (inst_rc === 'both') {
    inst_rc = 'row';
  }
  let cat_breakdown = calc_cat_cluster_breakdown(params, inst_data, inst_rc);
  if (cat_breakdown.length > 0) {
    // put cluster information in dendro_tip
    ///////////////////////////////////////////
    const cluster_info_container = d3.select(
      selector + ' .cluster_info_container'
    );
    // loop through cat_breakdown data
    let width = 370;
    const title_height = 27;
    let shift_tooltip_left = 177;
    const bar_offset = 23;
    // these are the indexes where the number-of-nodes and the number of downsampled
    // nodes are stored
    const num_nodes_index = 4;
    const num_nodes_ds_index = 5;
    const offset_ds_count = 150;
    let is_downsampled = false;
    if (cat_breakdown[0].bar_data[0][num_nodes_ds_index] != null) {
      width = width + 100;
      shift_tooltip_left = shift_tooltip_left + offset_ds_count - 47;
      is_downsampled = true;
    }
    // the index that will be used to generate the bars (will be different if
    // downsampled)
    let cluster_total = dendro_info.all_names.length;
    let bars_index = num_nodes_index;
    if (is_downsampled) {
      bars_index = num_nodes_ds_index;
      // calculate the total number of nodes in downsampled case
      const inst_bar_data = cat_breakdown[0].bar_data;
      cluster_total = 0;
      each(inst_bar_data, function (tmp_data) {
        cluster_total = cluster_total + tmp_data[num_nodes_ds_index];
      });
    }
    // limit on the number of category types shown
    const max_cats = 3;
    // limit the number of bars shown
    const max_bars = 25;
    // calculate height needed for svg based on cat_breakdown data
    let svg_height = 20;
    cat_breakdown.slice(0, max_cats).forEach(function (tmp_break) {
      let num_bars = tmp_break.bar_data.length;
      if (num_bars > max_bars) {
        num_bars = max_bars;
      }
      svg_height = svg_height + title_height * (num_bars + 1);
    });
    // Cluster Information Title (for tooltip only not modal)
    if (tooltip) {
      cluster_info_container.append('text').text('Cluster Information');
    }
    const main_dendro_svg = cluster_info_container
      .append('div')
      .style('margin-top', '5px')
      .classed('cat_graph', true)
      .append('svg')
      .style('height', svg_height + 'px')
      .style('width', width + 'px');
    cluster_info_container.style('margin-bottom', '5px');
    // make background
    main_dendro_svg
      .append('rect')
      .classed('cat_background', true)
      .attr('height', svg_height + 'px')
      .attr('width', width + 'px')
      .attr('fill', 'white')
      .attr('opacity', 1);
    // limit the category-types
    cat_breakdown = cat_breakdown.slice(0, max_cats);
    // shift the position of the numbers based on the size of the number
    // offset the count column based on how large the counts are
    const digit_offset_scale = d3.scale
      .linear()
      .domain([0, 100000])
      .range([20, 30]);
    // the total amout to shift down the next category
    let shift_down = title_height;
    cat_breakdown.forEach(function (cat_data) {
      const max_bar_value = cat_data.bar_data[0][bars_index];
      const count_offset = digit_offset_scale(max_bar_value);
      const cat_graph_group = main_dendro_svg
        .append('g')
        .classed('cat_graph_group', true)
        .attr('transform', 'translate(10, ' + shift_down + ')');
      const cat_bar_container = cat_graph_group
        .append('g')
        .classed('cat_bar_container', true)
        .attr('transform', 'translate(0, 10)');
      // make bar groups (hold bar and text)
      const cat_bar_groups = cat_bar_container
        .selectAll('g')
        .data(cat_data.bar_data)
        .enter()
        .append('g')
        .attr('transform', function (d, i) {
          const inst_y = i * bar_offset;
          return 'translate(0,' + inst_y + ')';
        });
      cat_breakdown_bars(
        params,
        cat_data,
        cat_graph_group,
        title_height,
        bars_index,
        max_bars,
        cat_bar_groups
      );
      cat_breakdown_values(
        params,
        cat_graph_group,
        cat_bar_groups,
        num_nodes_index,
        is_downsampled,
        count_offset,
        bars_index,
        cluster_total
      );
      // shift down based on number of bars
      shift_down = shift_down + title_height * (cat_data.bar_data.length + 1);
    });
    // reposition tooltip
    /////////////////////////////////////////////////
    if (tooltip) {
      const dendro_tip = d3.select(selector);
      const old_top = dendro_tip.style('top').split('.px')[0];
      const old_left = dendro_tip.style('left').split('.px')[0];
      let shift_top = 0;
      let shift_left = 0;
      // shifting
      if (inst_rc === 'row') {
        // rows
        //////////////
        shift_top = 0;
        shift_left = shift_tooltip_left;
        // // prevent graph from being too high
        // if (dendro_info.pos_top < svg_height){
        //   // do not shift position of category breakdown graph
        //   // shift_top = -(svg_height + (dendro_info.pos_mid - dendro_info.pos_top)/2) ;
        // }
      } else {
        // columns
        //////////////
        shift_top = svg_height + 32;
        shift_left = 30;
      }
      dendro_tip
        .style('top', function () {
          const new_top = String(parseInt(old_top, 10) - shift_top) + 'px';
          return new_top;
        })
        .style('left', function () {
          const new_left = String(parseInt(old_left, 10) - shift_left) + 'px';
          return new_left;
        });
    }
  }
});
