var button_section = require('./make_tree_menu_button_section');
var make_tree_menu_update_button = require('./make_tree_menu_update_button');
var position_tree_menu = require('./position_tree_menu');

module.exports = function make_tree_menu(cgm){

  var params = cgm.params;
  var menu_width = cgm.params.viz.tree_menu_width;
  var menu_height = cgm.params.viz.tree_menu_height;
  var x_offset = cgm.params.viz.tree_menu_x_offset;

  // make tree menu (state is in cgm, remade each time)
  /////////////////////////////////////////////////////
  var tree_menu = d3.select(params.root+' .viz_svg')
    .append('g')
    .attr('cursor', 'default')
    .classed('tree_menu', true)
    .classed('svg_menus', true);

  position_tree_menu(cgm);

  tree_menu
    .attr('opacity', 0.0)
    .transition()
    .attr('opacity', 1.0);

  var menu_opacity = 0.95;

  tree_menu
    .append('rect')
    .classed('tree_menu_background', true)
    .attr('width', function(){
      var inst_width = menu_width;
      return inst_width;
    })
    .attr('height', menu_height)
    .attr('fill', 'white')
    .attr('stroke', '#A3A3A3')
    .attr('stroke-width', '3px')
    .attr('opacity', menu_opacity);

  // Clustering Parameters
  tree_menu
    .append('text')
    .classed('tree_menu_title', true)
    .attr('transform', 'translate(' + x_offset + ',30)')
    .attr('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .attr('font-size','18px')
    .attr('font-weight', 800)
    .attr('cursor', 'default')
    .text('Clustering Parameters');

  var button_info = {};
  button_info.cgm = cgm;
  button_info.tree_menu = tree_menu;
  button_info.menu_width = menu_width;
  button_info.distance_metric = cgm.params.matrix.distance_metric;
  button_info.linkage_type = cgm.params.matrix.linkage_type;
  button_info.default_x_offset = x_offset;

  // linkage
  /////////////////
  var distance_names = ['cosine', 'euclidean', 'correlation'];
  button_info.name = 'Distance Metric';
  button_info.y_offset = 65;
  button_info.x_offset = 0;
  button_section('distance_metric', button_info, distance_names);

  // linkage
  /////////////////
  var linkage_names = ['average', 'single', 'complete'];
  button_info.name = 'Linkage Type';
  button_info.y_offset = 65;
  button_info.x_offset = menu_width/2;
  button_section('linkage_type', button_info, linkage_names);

  // // Z-score
  // /////////////////
  // var zscore_names = ['row', 'col'];
  // button_info.name = 'Linkage Type';
  // button_info.y_offset = 200;
  // button_info.x_offset = 0;
  // button_section(button_info, linkage_names, distance_click)

  make_tree_menu_update_button(cgm, button_info);

};