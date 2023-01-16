import d3 from "d3";
import reset_size_after_update from "../reset_size/reset_size_after_update.js";
import make_row_label_container from "../labels/make_row_label_container.js";
import make_col_label_container from "../labels/make_col_label_container.js";
import eeu_existing_row from "./eeu_existing_row.js";
import exit_components from "../exit/exit_components.js";
import draw_gridlines from "../matrix/draw_gridlines.js";
import enter_row_groups from "./enter_row_groups.js";
import resize_containers from "../reset_size/resize_containers.js";
import label_constrain_and_trim from "../labels/label_constrain_and_trim.js";
import d3_tip_custom from "../tooltip/d3_tip_custom.js";
export default (function enter_exit_update(cgm, network_data, delays) {
    const params = cgm.params;
    // remove old tooltips
    d3.selectAll(params.viz.root_tips).remove();
    // d3-tooltip - for tiles
    const tip = d3_tip_custom()
        .attr('class', function () {
        const root_tip_selector = params.viz.root_tips.replace('.', '');
        const class_string = root_tip_selector + ' d3-tip ' + root_tip_selector + '_tile_tip';
        return class_string;
    })
        .direction('nw')
        .offset([0, 0])
        .style('display', 'none')
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
        }
        else {
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
    d3.select(params.root + ' .clust_group').call(tip);
    // necessary for repositioning clust, col and col-cat containers
    resize_containers(params);
    const duration = 1000;
    // make global so that names can be accessed
    const row_nodes = network_data.row_nodes;
    const col_nodes = network_data.col_nodes;
    const links = network_data.links;
    //
    const tile_data = links;
    // add name to links for object constancy
    for (let i = 0; i < tile_data.length; i++) {
        const d = tile_data[i];
        tile_data[i].name =
            row_nodes[d.source].name + '_' + col_nodes[d.target].name;
    }
    // move rows
    const move_rows = d3
        .select(params.root + ' .clust_group')
        .selectAll('.row')
        .data(params.matrix.matrix, function (d) {
        return d.name;
    });
    if (delays.run_transition) {
        move_rows
            .transition()
            .delay(delays.update)
            .duration(duration)
            .attr('transform', function (d) {
            const tmp_index = d.row_index;
            return 'translate(0,' + params.viz.y_scale(tmp_index) + ')';
        });
    }
    else {
        move_rows.attr('transform', function (d) {
            const tmp_index = d.row_index;
            return 'translate(0,' + params.viz.y_scale(tmp_index) + ')';
        });
    }
    // update existing rows - enter, exit, update tiles in existing row
    d3.select(params.root + ' .clust_group')
        .selectAll('.row')
        .each(function (d) {
        // TODO add tip back to arguments
        const inst_selection = this;
        eeu_existing_row(params, d, delays, duration, inst_selection, tip);
    });
    d3.selectAll(params.root + ' .horz_lines').remove();
    d3.selectAll(params.root + ' .vert_lines').remove();
    // exit
    ////////////
    exit_components(params, delays, duration);
    // resize clust components using appropriate delays
    reset_size_after_update(cgm, duration, delays);
    // enter new elements
    //////////////////////////
    enter_row_groups(params, delays, duration, tip);
    // update existing rows
    make_row_label_container(cgm, duration);
    make_col_label_container(cgm, duration);
    draw_gridlines(params, delays, duration);
    setTimeout(label_constrain_and_trim, 2000, params);
});
