import d3 from "d3";
import calc_row_dendro_triangles from "./calc_row_dendro_triangles.js";
import calc_col_dendro_triangles from "./calc_col_dendro_triangles.js";
import d3_tip_custom from "../tooltip/d3_tip_custom.js";
import dendro_group_highlight from "./dendro_group_highlight.js";
import run_dendro_filter from "./run_dendro_filter.js";
import zoom_crop_triangles from "../zoom/zoom_crop_triangles.js";
export default (function make_dendro_crop_buttons(cgm, inst_rc) {
    const params = cgm.params;
    const button_opacity = params.viz.dendro_opacity * 0.6;
    // information needed to make dendro
    let dendro_info;
    let other_rc;
    if (params.viz.show_dendrogram) {
        if (inst_rc === 'row') {
            dendro_info = calc_row_dendro_triangles(params);
            other_rc = 'col';
        }
        else {
            dendro_info = calc_col_dendro_triangles(params);
            other_rc = 'row';
        }
    }
    // d3-tooltip
    const tmp_y_offset = 5;
    const tmp_x_offset = -5;
    const dendro_crop_tip = d3_tip_custom()
        .attr('class', function () {
        const root_tip_selector = params.viz.root_tips.replace('.', '');
        const class_string = root_tip_selector +
            ' d3-tip ' +
            root_tip_selector +
            '_' +
            inst_rc +
            '_dendro_crop_tip';
        return class_string;
    })
        .direction('nw')
        .style('display', 'none')
        .offset([tmp_y_offset, tmp_x_offset]);
    const wait_before_tooltip = 500;
    d3.selectAll(params.viz.root_tips + '_' + inst_rc + '_dendro_crop_tip').remove();
    d3.selectAll(params.root + ' .' + inst_rc + '_dendro_crop_buttons').remove();
    let icons;
    // position triangles
    let start_x;
    let start_y;
    let mid_x;
    let mid_y;
    let final_x;
    let final_y;
    // need to improve to account for zooming
    const min_tri_height = 45;
    const scale_down_tri = 0.25;
    let tri_height;
    let tri_width;
    let tri_dim;
    // make crop buttons or undo buttons
    const button_class = inst_rc + '_dendro_crop_buttons';
    if (d3
        .select(cgm.params.root + ' .' + inst_rc + '_dendro_icons_group')
        .classed('ran_filter') === false) {
        // Crop Triangle
        //////////////////////////////
        icons = d3
            .select(params.root + ' .' + inst_rc + '_dendro_icons_group')
            .selectAll('path')
            .data(dendro_info, function (d) {
            return d.name;
        })
            .enter()
            .append('path')
            .classed(button_class, true)
            .attr('d', function (d) {
            // redefine
            tri_height = 10;
            tri_width = 10;
            const tmp_height = d.pos_bot - d.pos_top;
            // Row Dendrogram Crop Triangle
            if (inst_rc === 'row') {
                if (tmp_height < min_tri_height) {
                    tri_height = tmp_height * scale_down_tri;
                }
                // pointing left
                start_x = tri_width;
                start_y = -tri_height;
                mid_x = 0;
                mid_y = 0;
                final_x = tri_width;
                final_y = tri_height;
                tri_dim = tri_height;
                // Column Dendrogram Crop Triangle
            }
            else {
                if (tmp_height < min_tri_height) {
                    tri_width = tmp_height * scale_down_tri;
                }
                // pointing upward
                start_x = -tri_width;
                start_y = tri_height;
                mid_x = 0;
                mid_y = 0;
                final_x = tri_width;
                final_y = tri_height;
                tri_dim = tri_width;
            }
            // save triangle height
            // d3.select(this)[0][0].__data__.tri_dim = tri_dim;
            const data_key = '__data__';
            d3.select(this)[0][0][data_key].tri_dim = tri_dim;
            const output_string = 'M' +
                start_x +
                ',' +
                start_y +
                ' L' +
                mid_x +
                ', ' +
                mid_y +
                ' L' +
                final_x +
                ',' +
                final_y +
                ' Z';
            return output_string;
        });
        dendro_crop_tip.html(function () {
            const full_string = 'Click to crop cluster';
            return full_string;
        });
    }
    else {
        // Undo Triangle
        //////////////////////////////
        icons = d3
            .select(params.root + ' .' + inst_rc + '_dendro_icons_group')
            .selectAll('path')
            .data(dendro_info, function (d) {
            return d.name;
        })
            .enter()
            .append('path')
            .classed(button_class, true)
            .attr('d', function (d) {
            // redefine
            tri_height = 10;
            tri_width = 12;
            const tmp_height = d.pos_bot - d.pos_top;
            if (inst_rc === 'row') {
                if (tmp_height < min_tri_height) {
                    tri_height = tmp_height * scale_down_tri;
                }
                // pointing right
                start_x = 0;
                start_y = -tri_height;
                mid_x = tri_width;
                mid_y = 0;
                final_x = 0;
                final_y = tri_height;
            }
            else {
                if (tmp_height < min_tri_height) {
                    tri_width = tmp_height * scale_down_tri;
                }
                // pointing downward
                start_x = -tri_width;
                start_y = 0;
                mid_x = 0;
                mid_y = tri_height;
                final_x = tri_width;
                final_y = 0;
            }
            // save triangle height
            const data_key = '__data__';
            d3.select(this)[0][0][data_key].tri_dim = 10;
            const output_string = 'M' +
                start_x +
                ',' +
                start_y +
                ' L' +
                mid_x +
                ', ' +
                mid_y +
                ' L' +
                final_x +
                ',' +
                final_y +
                ' Z';
            return output_string;
        });
        dendro_crop_tip.html(function () {
            const full_string = 'Click to undo crop';
            return full_string;
        });
    }
    icons
        .style('cursor', 'pointer')
        .style('opacity', function () {
        // if (d3.select(this).classed('hide_crop')){
        //   inst_opacity = 0;
        // } else {
        //   inst_opacity = button_opacity;
        // }
        return button_opacity;
    })
        .attr('transform', function (d) {
        let inst_x;
        let inst_y;
        if (inst_rc === 'row') {
            inst_x = params.viz.uni_margin;
            inst_y = d.pos_mid;
        }
        else {
            inst_x = d.pos_mid;
            inst_y = params.viz.uni_margin;
        }
        return 'translate(' + inst_x + ',' + inst_y + ')';
    })
        .on('mouseover', function (d) {
        d3.select(this).classed('hovering', true);
        dendro_crop_tip.show(d);
        dendro_group_highlight(params, this, d, inst_rc);
        // display with zero opacity
        d3.selectAll(params.viz.root_tips + '_' + inst_rc + '_dendro_crop_tip')
            .style('opacity', 0)
            .style('display', 'block');
        // check if still hovering
        setTimeout(still_hovering, wait_before_tooltip, this);
    })
        .on('mouseout', function () {
        d3.select(this).classed('hovering', false);
        d3.selectAll(params.root + ' .dendro_shadow').remove();
        d3.select(this).style('opacity', button_opacity);
        dendro_crop_tip.hide(this);
    })
        .on('click', function (d) {
        // give user visual cue
        d3.select(this)
            .style('opacity', 0.9)
            .transition()
            .duration(1000)
            .style('opacity', 0);
        // remove dendro shadows when clicked
        d3.selectAll(params.root + ' .dendro_shadow').remove();
        /* filter using dendrogram */
        if (cgm.params.dendro_filter.row === false &&
            cgm.params.dendro_filter.col === false &&
            cgm.params.cat_filter.row === false &&
            cgm.params.cat_filter.col === false) {
            // Run Filtering
            ///////////////////
            // use class as 'global' variable
            d3.select(cgm.params.root + ' .' + inst_rc + '_dendro_icons_group')
                .attr('transform', 'translate(0,0), scale(1,1)')
                .classed('ran_filter', true);
            d3.select(cgm.params.root + ' .' + other_rc + '_dendro_icons_group').attr('transform', 'translate(0,0), scale(1,1)');
            // do not display dendrogram slider if filtering has been run
            d3.select(cgm.params.root + ' .' + inst_rc + '_slider_group').style('display', 'none');
            // do not display other crop buttons since they are inactive
            d3.select(cgm.params.root + ' .' + other_rc + '_dendro_icons_container').style('display', 'none');
            // do not display brush-crop button if performing dendro crop
            d3.select(cgm.params.root + ' .crop_button').style('opacity', 0.2);
        }
        else {
            // Undo Filtering
            ///////////////////
            // use class as 'global' variable
            d3.select(cgm.params.root + ' .' + inst_rc + '_dendro_icons_group')
                .attr('transform', 'translate(0,0), scale(1,1)')
                .classed('ran_filter', false);
            d3.select(cgm.params.root + ' .' + other_rc + '_dendro_icons_group').attr('transform', 'translate(0,0), scale(1,1)');
            if (params.viz.inst_order[other_rc] === 'clust') {
                // display slider when cropping has not been done
                d3.select(cgm.params.root + ' .' + inst_rc + '_slider_group').style('display', 'block');
            }
            // display other crop buttons when cropping has not been done
            d3.select(cgm.params.root + ' .' + other_rc + '_dendro_icons_container').style('display', 'block');
            // display brush-crop button if not performing dendro crop
            d3.select(cgm.params.root + ' .crop_button').style('opacity', 1);
        }
        run_dendro_filter(cgm, d, inst_rc);
    })
        .call(dendro_crop_tip);
    // ordering has been reversed
    if (params.viz.inst_order[other_rc] != 'clust') {
        // do not display if not in cluster order
        d3.select(params.root + ' .' + inst_rc + '_dendro_icons_group')
            .selectAll('path')
            .style('display', 'none');
    }
    function still_hovering(inst_selection) {
        if (d3.select(inst_selection).classed('hovering')) {
            // increase opacity
            d3.selectAll(params.viz.root_tips + '_' + inst_rc + '_dendro_crop_tip')
                .style('opacity', 1)
                .style('display', 'block');
        }
    }
    zoom_crop_triangles(params, params.zoom_info, inst_rc);
});
