const d3 = require('d3');
const cat_tooltip_text = require('./cat_tooltip_text');
const d3_tip_custom = require('../tooltip/d3_tip_custom');
const reset_cat_opacity = require('./reset_cat_opacity');
const ini_cat_opacity = require('./ini_cat_opacity');
// var click_filter_cats = require('./click_filter_cats');
const get_cat_names = require('../categories/get_cat_names');
const each = require('underscore/cjs/each');
const $ = require('jquery');

module.exports = function make_col_cat(cgm) {
  const params = cgm.params;

  // make or reuse outer container
  if (d3.select(params.root + ' .col_cat_outer_container').empty()) {
    d3.select(params.root + ' .col_container')
      .append('g')
      .attr('class', 'col_cat_outer_container')
      .attr('transform', function () {
        const inst_offset = params.viz.norm_labels.width.col + 2;
        return 'translate(0,' + inst_offset + ')';
      })
      .append('g')
      .attr('class', 'col_cat_container');
  } else {
    d3.select(params.root + ' .col_container')
      .select('col_cat_outer_container')
      .attr('transform', function () {
        const inst_offset = params.viz.norm_labels.width.col + 2;
        return 'translate(0,' + inst_offset + ')';
      });
  }

  // remove old col_cat_tips
  d3.selectAll(params.viz.root_tips + '_col_cat_tip').remove();

  // d3-tooltip
  const cat_tip = d3_tip_custom()
    .attr('class', function () {
      const root_tip_selector = params.viz.root_tips.replace('.', '');
      const class_string =
        root_tip_selector + ' d3-tip ' + root_tip_selector + '_col_cat_tip';
      return class_string;
    })
    .direction('s')
    .offset([5, 0])
    .style('display', 'none')
    .html(function (d) {
      return cat_tooltip_text(params, d, this, 'col');
    });

  // append groups - each will hold classification rects
  d3.select(params.root + ' .col_cat_container')
    .selectAll('g')
    .data(params.network_data.col_nodes, function (d) {
      return d.name;
    })
    .enter()
    .append('g')
    .attr('class', 'col_cat_group')
    .attr('transform', function (d) {
      const inst_index = (params.network_data.col_nodes_names || []).indexOf(
        d.name
      );
      // return 'translate(' + params.viz.x_scale(d.col_index) + ',0)';
      return 'translate(' + params.viz.x_scale(inst_index) + ',0)';
    });

  d3.select(params.root + ' .col_cat_container')
    .selectAll('.col_cat_group')
    .call(cat_tip);

  // add category rects
  d3.selectAll(params.root + ' .col_cat_group').each(function () {
    const inst_selection = this;
    let cat_rect;

    each(params.viz.all_cats.col, function (inst_cat) {
      const inst_num = parseInt(inst_cat.split('-')[1], 10);
      const cat_rect_class = 'col_cat_rect_' + String(inst_num);

      if (
        d3
          .select(inst_selection)
          .select('.' + cat_rect_class)
          .empty()
      ) {
        cat_rect = d3
          .select(inst_selection)
          .append('rect')
          .attr('class', cat_rect_class)
          .attr('cat', inst_cat)
          .attr('transform', function () {
            const cat_room =
              params.viz.cat_room.symbol_width + params.viz.cat_room.separation;
            const inst_shift = inst_num * cat_room;
            return 'translate(0,' + inst_shift + ')';
          })
          .on('click', function (d) {
            if (d3.select(this).classed('cat_strings')) {
              const found_names = get_cat_names(params, d, this, 'col');

              $(params.root + ' .dendro_info').modal('toggle');
              const group_string = found_names.join(', ');
              d3.select(params.root + ' .dendro_info input').attr(
                'value',
                group_string
              );
            }
          });
      } else {
        cat_rect = d3.select(inst_selection).select('.' + cat_rect_class);
      }

      cat_rect
        .attr('width', params.viz.x_scale.rangeBand())
        .attr('height', params.viz.cat_room.symbol_width)
        .style('fill', function (d) {
          const cat_name = d[inst_cat];
          const inst_color = params.viz.cat_colors.col[inst_cat][cat_name];
          return inst_color;
        })
        .on('mouseover', cat_tip.show)
        .on('mouseout', function () {
          cat_tip.hide(this);
          reset_cat_opacity(params);
          d3.select(this).classed('hovering', false);

          d3.selectAll('.d3-tip').style('display', 'none');
        });

      ini_cat_opacity(params.viz, 'col', cat_rect, inst_cat);
    });
  });
};
