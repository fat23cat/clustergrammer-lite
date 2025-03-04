const d3 = require('d3');
const make_simple_rows = require('./make_simple_rows');
const d3_tip_custom = require('../tooltip/d3_tip_custom');
const each = require('underscore/cjs/each');
const contains = require('underscore/cjs/contains');

// current matrix can change with downsampling
module.exports = function make_matrix_rows(
  params,
  current_matrix,
  row_names = 'all',
  ds_level = -1
) {
  // defaults
  let y_scale = params.viz.y_scale;
  let make_tip = true;
  let row_class = 'row';

  if (ds_level >= 0) {
    y_scale = params.viz.ds[ds_level].y_scale;

    // do not show tip when rows are downsampled
    make_tip = false;
    row_class = 'ds' + String(ds_level) + '_row';
  }

  let tip;

  if (make_tip) {
    // do not remove tile_tip here
    /////////////////////////////////

    // make rows in the matrix - add key names to rows in matrix
    /////////////////////////////////////////////////////////////
    // d3-tooltip - for tiles
    tip = d3_tip_custom()
      .attr('class', function () {
        const root_tip_selector = params.viz.root_tips.replace('.', '');
        const class_string =
          root_tip_selector + ' d3-tip ' + root_tip_selector + '_tile_tip';
        return class_string;
      })
      .style('display', 'none')
      .direction('nw')
      .offset([0, 0])
      .html(function (d) {
        const inst_value = String(d.value.toFixed(3));
        let tooltip_string;

        if (params.keep_orig) {
          const orig_value = String(d.value_orig.toFixed(3));
          tooltip_string =
            '<p>' +
            d.row_name +
            ' and ' +
            d.col_name +
            '</p>' +
            '<p> normalized value: ' +
            inst_value +
            '</p>' +
            '<div> original value: ' +
            orig_value +
            '</div>';
        } else {
          tooltip_string =
            '<p>' +
            d.row_name +
            ' and ' +
            d.col_name +
            '</p>' +
            '<div> value: ' +
            inst_value +
            '</div>';
        }

        return tooltip_string;
      });
  } else {
    tip = null;
  }

  // gather a subset of row data from the matrix or use all rows
  let matrix_subset = [];
  if (row_names === 'all') {
    matrix_subset = current_matrix;
  } else {
    each(current_matrix, function (inst_row) {
      if (contains(row_names, inst_row.name)) {
        matrix_subset.push(inst_row);
      }
    });
  }

  d3.select(params.root + ' .clust_group')
    .selectAll('.row')
    .data(matrix_subset, function (d) {
      return d.name;
    })
    .enter()
    .append('g')
    .classed(row_class, true)
    .attr('transform', function (d) {
      return 'translate(0,' + y_scale(d.row_index) + ')';
    })
    .each(function (d) {
      make_simple_rows(params, d, tip, this, ds_level);
    });

  if (params.viz.ds_level === -1 && tip != null) {
    d3.selectAll(params.root + ' .row').call(tip);
  }
};
