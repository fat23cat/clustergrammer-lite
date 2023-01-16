import d3 from "d3";
import change_groups from "./change_groups.js";
import position_dendro_slider from "./position_dendro_slider.js";
export default (function build_single_dendro_slider(cgm, inst_rc) {
    const slider_length = 100;
    const drag = d3.behavior
        .drag()
        .on('drag', dragging)
        .on('dragend', function () {
        cgm.params.is_slider_drag = false;
    });
    const slider_group = d3
        .select(cgm.params.root + ' .viz_svg')
        .append('g')
        .classed(inst_rc + '_slider_group', true);
    position_dendro_slider(cgm, inst_rc);
    const rect_height = slider_length + 20;
    const rect_width = 30;
    slider_group
        .append('rect')
        .classed(inst_rc + '_slider_background', true)
        .attr('height', rect_height + 'px')
        .attr('width', rect_width + 'px')
        .attr('fill', cgm.params.viz.background_color)
        .attr('transform', function () {
        const translate_string = 'translate(-10, -5)';
        return translate_string;
    })
        .style('opacity', 0);
    slider_group
        .append('line')
        .style('stroke-width', slider_length / 7 + 'px')
        .style('stroke', 'black')
        .style('stroke-linecap', 'round')
        .style('opacity', 0.0)
        .attr('y1', 0)
        .attr('y2', function () {
        return slider_length - 2;
    })
        .on('click', click_dendro_slider);
    const offset_triangle = -slider_length / 40;
    slider_group
        .append('path')
        .style('fill', 'black')
        .attr('transform', 'translate(' + offset_triangle + ', 0)')
        .attr('d', function () {
        // up triangle
        const start_x = 0;
        const start_y = 0;
        const mid_x = 0;
        const mid_y = slider_length;
        const final_x = slider_length / 10;
        const final_y = 0;
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
    })
        .style('opacity', 0.35)
        .on('click', click_dendro_slider);
    const default_opacity = 0.35;
    const high_opacity = 0.6;
    slider_group
        .append('circle')
        .classed(inst_rc + '_group_circle', true)
        .attr('r', slider_length * 0.08)
        .attr('transform', function () {
        return 'translate(0, ' + slider_length / 2 + ')';
    })
        .style('fill', 'blue')
        .style('opacity', default_opacity)
        .on('mouseover', function () {
        d3.select(this).style('opacity', high_opacity);
    })
        .on('mouseout', function () {
        d3.select(this).style('opacity', default_opacity);
    })
        .call(drag);
    function dragging() {
        cgm.params.is_slider_drag = true;
        // d[0] = d3.event.x;
        let slider_pos = d3.event.y;
        if (slider_pos < 0) {
            slider_pos = 0;
        }
        if (slider_pos > slider_length) {
            slider_pos = slider_length;
        }
        if (this.nextSibling) {
            this.parentNode.appendChild(this);
        }
        slider_pos = d3.round(slider_pos, -1);
        const slider_value = 10 - slider_pos / 10;
        d3.select(this).attr('transform', 'translate(0, ' + slider_pos + ')');
        change_groups(cgm, inst_rc, slider_value);
    }
    function click_dendro_slider() {
        const clicked_line_position = d3.mouse(this);
        const rel_pos = d3.round(clicked_line_position[1], -1);
        d3.select(cgm.params.root + ' .' + inst_rc + '_group_circle').attr('transform', 'translate(0, ' + rel_pos + ')');
        const slider_value = 10 - rel_pos / 10;
        change_groups(cgm, inst_rc, slider_value);
    }
});
