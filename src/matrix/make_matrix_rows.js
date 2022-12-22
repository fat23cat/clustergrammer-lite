var make_simple_rows = require('./make_simple_rows');
var d3_tip_custom = require('../tooltip/d3_tip_custom');
var each = require('underscore/cjs/each');
var contains = require('underscore/cjs/contains');

// current matrix can change with downsampling
module.exports = function make_matrix_rows(
  params,
  current_matrix,
  row_names = 'all',
  ds_level = -1
) {
  // defaults
  var y_scale = params.viz.y_scale;
  var make_tip = true;
  var row_class = 'row';

  if (ds_level >= 0) {
    y_scale = params.viz.ds[ds_level].y_scale;

    // do not show tip when rows are downsampled
    make_tip = false;
    row_class = 'ds' + String(ds_level) + '_row';
  }

  if (make_tip) {
    // do not remove tile_tip here
    /////////////////////////////////

    // make rows in the matrix - add key names to rows in matrix
    /////////////////////////////////////////////////////////////
    // d3-tooltip - for tiles
    var tip = d3_tip_custom()
      .attr('class', function () {
        var root_tip_selector = params.viz.root_tips.replace('.', '');
        var class_string =
          root_tip_selector + ' d3-tip ' + root_tip_selector + '_tile_tip';
        return class_string;
      })
      .style('display', 'none')
      .direction('nw')
      .offset([0, 0])
      .html(function (d) {
        var inst_value = String(d.value.toFixed(3));
        var tooltip_string;

        if (params.keep_orig) {
          var orig_value = String(d.value_orig.toFixed(3));
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
  var matrix_subset = [];
  if (row_names === 'all') {
    matrix_subset = current_matrix;
  } else {
    each(current_matrix, function (inst_row) {
      if (contains(row_names, inst_row.name)) {
        matrix_subset.push(inst_row);
      }
    });
  }

  d3.select(params.root + ' .clust_group').on('click', function (e) {
    // console.log('size', this);
    // console.log('mouse', d3.mouse(this));
    // console.log('e', e);
    const coord = d3.mouse(this);
    const bounds = this.getBoundingClientRect();
    const x = coord[0] - bounds.left;
    const y = coord[1] - bounds.top;
    const row = bounds.height / params.inst_nodes.row_nodes.length;
    const col = bounds.width / params.inst_nodes.col_nodes.length;

    let countX = 0;
    for (let i = 0; i < params.inst_nodes.row_nodes.length; i++) {
      if (countX > x) {
        console.log(i);
        console.log(params.inst_nodes.row_nodes[Math.floor(i)]);
        break;
      }
      countX += row;
    }

    let countY = 0;
    for (let i = 0; i < params.inst_nodes.col_nodes.length; i++) {
      if (countY > y) {
        console.log(i);
        console.log(params.inst_nodes.col_nodes[Math.floor(i)]);
        break;
      }
      countY += col;
    }
  });

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
