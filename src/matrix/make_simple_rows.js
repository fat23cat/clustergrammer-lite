const d3 = require('d3');
const draw_up_tile = require('../enter/draw_up_tile');
const draw_dn_tile = require('../enter/draw_dn_tile');
const mouseover_tile = require('./mouseover_tile');
const mouseout_tile = require('./mouseout_tile');
const fine_position_tile = require('./fine_position_tile');
const filter = require('underscore/cjs/filter');
const utils = require('../Utils_clust');
const click_tile = require('./click_tile');

const POSITION_INACCURACY = 2;

module.exports = function make_simple_rows(
  params,
  inst_data,
  tip,
  row_selection,
  ds_level = -1
) {
  const inp_row_data = inst_data.row_data;

  const make_tip = true;
  let rect_height = params.viz.rect_height;
  if (ds_level >= 0) {
    // make_tip = false;
    rect_height = params.viz.ds[ds_level].rect_height;
  }

  let keep_orig;
  if (utils.has(params.network_data.links[0], 'value_orig')) {
    keep_orig = true;
  } else {
    keep_orig = false;
  }

  let row_values;
  if (keep_orig === false) {
    // value: remove zero values to make visualization faster
    row_values = filter(inp_row_data, function (num) {
      return num.value !== 0;
    });
  } else {
    row_values = inp_row_data;
  }

  // generate tiles in the current row
  const tile = d3
    .select(row_selection)
    .selectAll('rect')
    .data(row_values, function (d) {
      return d.col_name;
    })
    .enter()
    .append('rect')
    .attr('class', 'tile row_tile')
    .attr('width', params.viz.rect_width)
    .attr('height', rect_height)
    .style('fill', function (d) {
      // switch the color based on up/dn value
      let inst_fill;
      if (d.value_orig === 'NaN') {
        inst_fill = '#000000';
      } else {
        inst_fill =
          d.value > 0
            ? params.matrix.tile_colors[0]
            : params.matrix.tile_colors[1];
      }
      return inst_fill;
    })
    .style('fill-opacity', function (d) {
      // calculate output opacity using the opacity scale
      let inst_opacity;
      if (d.value_orig === 'NaN') {
        // console.log('found NaN while making tiles');
        inst_opacity = 0.175;
      } else {
        inst_opacity = params.matrix.opacity_scale(Math.abs(d.value));
      }
      return inst_opacity;
    })
    .attr('transform', function (d) {
      return fine_position_tile(params, d);
    });

  if (make_tip) {
    let data = null;
    let posX;
    let posY = null;
    tile
      .on('mouseover', function mouseover() {
        const args = Array.from(arguments);
        mouseover_tile(params, this, tip, args);
        data = args;
      })
      .on('mouseout', function mouseout() {
        mouseout_tile(params, this, tip);
        data = null;
      })
      .on('mousedown', function mousedown() {
        const { clientX, clientY } = d3.event;
        posX = clientX;
        posY = clientY;
      })
      .on('mouseup', function mouseup() {
        const { clientX, clientY } = d3.event;
        if (
          clientX <= posX + POSITION_INACCURACY &&
          clientX >= posX - POSITION_INACCURACY &&
          clientY <= posY + POSITION_INACCURACY &&
          clientY >= posY - POSITION_INACCURACY
        ) {
          click_tile(data);
        }
      });
  }

  // // tile circles
  // /////////////////////////////
  // var tile = d3.select(row_selection)
  //   .selectAll('circle')
  //   .data(row_values, function(d){ return d.col_name; })
  //   .enter()
  //   .append('circle')
  //   .attr('cx', params.viz.rect_height/2)
  //   .attr('cy', params.viz.rect_height/2)
  //   .attr('r', params.viz.rect_height/3)
  //   .attr('class', 'tile_circle')
  //   // .attr('width', params.viz.rect_width/2)
  //   // .attr('height', params.viz.rect_height/2)
  //   // // switch the color based on up/dn value
  //   // .style('fill', function(d) {
  //   //   // return d.value > 0 ? params.matrix.tile_colors[0] : params.matrix.tile_colors[1];
  //   //   return 'black';
  //   // })
  //   .on('mouseover', function(...args) {
  //       mouseover_tile(params, this, tip, args);
  //   })
  //   .on('mouseout', function() {
  //     mouseout_tile(params, this, tip);
  //   })
  //   .style('fill-opacity', function(d) {
  //     // calculate output opacity using the opacity scale
  //     var output_opacity = params.matrix.opacity_scale(Math.abs(d.value));
  //     if (output_opacity < 0.3){
  //       output_opacity = 0;
  //     } else if (output_opacity < 0.6){
  //       output_opacity = 0.35;
  //     } else {
  //       output_opacity = 1;
  //     }
  //     return output_opacity;
  //     // return 0.1;
  //   })
  //   .attr('transform', function(d) {
  //     return fine_position_tile(params, d);
  //   });

  if (params.matrix.tile_type == 'updn') {
    // value split
    const row_split_data = filter(inp_row_data, function (num) {
      return num.value_up != 0 || num.value_dn != 0;
    });

    // tile_up
    d3.select(row_selection)
      .selectAll('.tile_up')
      .data(row_split_data, function (d) {
        return d.col_name;
      })
      .enter()
      .append('path')
      .attr('class', 'tile_up')
      .attr('d', function () {
        return draw_up_tile(params);
      })
      .attr('transform', function (d) {
        fine_position_tile(params, d);
      })
      .style('fill', function () {
        return params.matrix.tile_colors[0];
      })
      .style('fill-opacity', function (d) {
        let inst_opacity = 0;
        if (Math.abs(d.value_dn) > 0) {
          inst_opacity = params.matrix.opacity_scale(Math.abs(d.value_up));
        }
        return inst_opacity;
      })
      .on('mouseover', function (...args) {
        mouseover_tile(params, this, tip, args);
      })
      .on('mouseout', function () {
        mouseout_tile(params, this, tip);
      });

    // tile_dn
    d3.select(row_selection)
      .selectAll('.tile_dn')
      .data(row_split_data, function (d) {
        return d.col_name;
      })
      .enter()
      .append('path')
      .attr('class', 'tile_dn')
      .attr('d', function () {
        return draw_dn_tile(params);
      })
      .attr('transform', function (d) {
        fine_position_tile(params, d);
      })
      .style('fill', function () {
        return params.matrix.tile_colors[1];
      })
      .style('fill-opacity', function (d) {
        let inst_opacity = 0;
        if (Math.abs(d.value_up) > 0) {
          inst_opacity = params.matrix.opacity_scale(Math.abs(d.value_dn));
        }
        return inst_opacity;
      })
      .on('mouseover', function (...args) {
        mouseover_tile(params, this, tip, args);
      })
      .on('mouseout', function () {
        mouseout_tile(params, this, tip);
      });

    // remove rect when tile is split
    tile.each(function (d) {
      if (Math.abs(d.value_up) > 0 && Math.abs(d.value_dn) > 0) {
        d3.select(this).remove();
      }
    });
  }

  // append title to group
  if (params.matrix.tile_title) {
    tile.append('title').text(function (d) {
      const inst_string = 'value: ' + d.value;
      return inst_string;
    });
  }
};
