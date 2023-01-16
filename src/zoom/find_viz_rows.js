import d3 from "d3";
export default (function find_viz_rows(params, viz_area) {
    const should_be_rows = [];
    const curr_rows = [];
    // find rows that should be visible
    let y_trans;
    // default y_scale (no downsampling)
    let y_scale = params.viz.y_scale;
    const ds_level = params.viz.ds_level;
    let row_names = params.network_data.row_nodes_names;
    let row_class = '.row';
    // if downsampling redefine variables
    if (ds_level >= 0) {
        y_scale = params.viz.ds[ds_level].y_scale;
        row_names = d3.range(params.matrix.ds_matrix[ds_level].length).map(String);
        row_class = '.ds' + String(ds_level) + '_row';
    }
    // find rows that should be visible
    for (let i = 0; i < row_names.length; i++) {
        y_trans = y_scale(i);
        if (y_trans < viz_area.max_y && y_trans > viz_area.min_y) {
            should_be_rows.push(row_names[i]);
        }
    }
    // find currently visible rows
    d3.selectAll(params.root + ' ' + row_class).each(function (d) {
        curr_rows.push(d.name);
    });
    // nodes that should be visible
    params.viz.viz_nodes.row = should_be_rows;
    // nodes that are visible
    params.viz.viz_nodes.curr_row = curr_rows;
});
