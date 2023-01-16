import calc_row_dendro_triangles from "./calc_row_dendro_triangles.js";
import calc_col_dendro_triangles from "./calc_col_dendro_triangles.js";
import dendro_group_highlight from "./dendro_group_highlight.js";
import d3_tip_custom from "../tooltip/d3_tip_custom.js";
import make_dendro_crop_buttons from "./make_dendro_crop_buttons.js";
import make_cat_breakdown_graph from "../categories/make_cat_breakdown_graph.js";
import * as $ from "jquery";
import d3 from "d3";
export default (function make_dendro_triangles(cgm, inst_rc, is_change_group = false) {
    const params = cgm.params;
    // in case sim_mat
    if (inst_rc === 'both') {
        inst_rc = 'row';
    }
    let other_rc;
    if (inst_rc === 'row') {
        other_rc = 'col';
    }
    else {
        other_rc = 'row';
    }
    // orders are switched!
    if (params.viz.inst_order[other_rc] === 'clust') {
        d3.select(params.root + ' .' + inst_rc + '_slider_group').style('opacity', 1);
    }
    let dendro_info;
    if (params.viz.show_dendrogram) {
        if (inst_rc === 'row') {
            dendro_info = calc_row_dendro_triangles(params);
        }
        else {
            dendro_info = calc_col_dendro_triangles(params);
        }
        if (d3
            .select(cgm.params.root + ' .' + inst_rc + '_dendro_crop_buttons')
            .empty() === false) {
            make_dendro_crop_buttons(cgm, inst_rc);
        }
    }
    // constant dendrogram opacity
    const inst_dendro_opacity = params.viz.dendro_opacity;
    function still_hovering(inst_selection, inst_data, i) {
        if (d3.select(inst_selection).classed('hovering')) {
            // define where graph should be built
            const inst_selector = params.viz.root_tips + '_' + inst_rc + '_dendro_tip';
            // prevent mouseover from making multiple graphs
            if (d3.select(inst_selector + ' .cat_graph').empty()) {
                if (params.viz.cat_info[inst_rc] !== null) {
                    make_cat_breakdown_graph(params, inst_rc, inst_data, dendro_info[i], inst_selector, true);
                }
            }
            d3.selectAll(params.viz.root_tips + '_' + inst_rc + '_dendro_tip').style('opacity', 1);
        }
    }
    const wait_before_tooltip = 500;
    // remove any old dendro tooltips from this visualization
    d3.selectAll(cgm.params.viz.root_tips + '_' + inst_rc + '_dendro_tip').remove();
    // run transition rules
    let run_transition;
    if (d3.selectAll(params.root + ' .' + inst_rc + '_dendro_group').empty()) {
        run_transition = false;
    }
    else {
        run_transition = true;
        d3.selectAll(params.root + ' .' + inst_rc + '_dendro_group').remove();
        // d3.selectAll(params.root+' .dendro_tip').remove();
    }
    // d3-tooltip
    const tmp_y_offset = 0;
    const tmp_x_offset = -5;
    const dendro_tip = d3_tip_custom()
        .attr('class', function () {
        // add root element to class
        const root_tip_selector = params.viz.root_tips.replace('.', '');
        const class_string = root_tip_selector +
            ' d3-tip ' +
            root_tip_selector +
            '_' +
            inst_rc +
            '_dendro_tip';
        return class_string;
    })
        .direction('nw')
        .offset([tmp_y_offset, tmp_x_offset])
        .style('display', 'none')
        .style('opacity', 0);
    dendro_tip.html(function () {
        const full_string = '<div class="cluster_info_container"></div>Click for cluster information <br>' +
            'and additional options.';
        return full_string;
    });
    if (is_change_group) {
        run_transition = false;
    }
    const dendro_traps = d3
        .select(params.root + ' .' + inst_rc + '_dendro_container')
        .selectAll('path')
        .data(dendro_info, function (d) {
        return d.name;
    })
        .enter()
        .append('path')
        .style('opacity', 0)
        .attr('class', inst_rc + '_dendro_group')
        .style('fill', 'black');
    // draw triangles (shown as trapezoids)
    //////////////////////////////////////////
    let start_x;
    let start_y;
    let mid_x;
    let mid_y;
    let final_x;
    let final_y;
    // row triangles
    dendro_traps.attr('d', function (d) {
        if (inst_rc === 'row') {
            // row triangles
            start_x = 0;
            start_y = d.pos_top;
            mid_x = 30;
            mid_y = d.pos_mid;
            final_x = 0;
            final_y = d.pos_bot;
        }
        else {
            // column triangles
            start_x = d.pos_top;
            start_y = 0;
            mid_x = d.pos_mid;
            mid_y = 30;
            final_x = d.pos_bot;
            final_y = 0;
        }
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
    dendro_traps
        .on('mouseover', function (d, i) {
        // if (params.sim_mat){
        //   inst_rc = 'both';
        // }
        // run instantly on mouseover
        d3.select(this).classed('hovering', true);
        if (cgm.params.dendro_callback != null) {
            cgm.params.dendro_callback(this);
        }
        // display tip
        // this is needed for it to show in the right place and the opacity
        // will be toggled to delay the tooltip for the user
        d3.select(params.viz.root_tips + '_' + inst_rc + '_dendro_tip').style('display', 'block');
        dendro_group_highlight(params, this, d, inst_rc);
        // show the tip (make sure it is displaying before it is shown)
        dendro_tip.show(d);
        // set opacity to zero
        d3.select(params.viz.root_tips + '_' + inst_rc + '_dendro_tip').style('opacity', 0);
        // check if still hovering
        setTimeout(still_hovering, wait_before_tooltip, this, d, i);
    })
        .on('mouseout', function () {
        if (params.viz.inst_order[other_rc] === 'clust') {
            d3.select(this).style('opacity', inst_dendro_opacity);
        }
        d3.selectAll(params.root + ' .dendro_shadow').remove();
        d3.select(this).classed('hovering', false);
        dendro_tip.hide(this);
    })
        .on('click', function (d, i) {
        $(params.root + ' .dendro_info').modal('toggle');
        const group_string = d.all_names.join(', ');
        d3.select(params.root + ' .dendro_info input').attr('value', group_string);
        const inst_selector = params.root + ' .dendro_info';
        // remove old graphs (modals are not within params.root)
        d3.selectAll('.dendro_info .cluster_info_container .cat_graph').remove();
        if (params.viz.cat_info[inst_rc] !== null) {
            make_cat_breakdown_graph(params, inst_rc, d, dendro_info[i], inst_selector);
        }
        if (cgm.params.dendro_click_callback != null) {
            cgm.params.dendro_click_callback(this);
        }
    })
        .call(dendro_tip);
    let triangle_opacity;
    if (params.viz.inst_order[other_rc] === 'clust') {
        triangle_opacity = inst_dendro_opacity;
    }
    else {
        triangle_opacity = 0;
    }
    if (run_transition) {
        d3.select(params.root + ' .' + inst_rc + '_dendro_container')
            .selectAll('path')
            .transition()
            .delay(1000)
            .duration(1000)
            .style('opacity', triangle_opacity);
    }
    else {
        d3.select(params.root + ' .' + inst_rc + '_dendro_container')
            .selectAll('path')
            .style('opacity', triangle_opacity);
    }
});
