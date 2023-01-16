import make_config from "./make_config.js";
import make_params from "./params/make_params.js";
import make_viz from "./make_viz.js";
import resize_viz from "./reset_size/resize_viz.js";
import play_demo from "./demo/play_demo.js";
import ini_demo from "./demo/ini_demo.js";
import filter_viz_using_nodes from "./network/filter_viz_using_nodes.js";
import filter_viz_using_names from "./network/filter_viz_using_names.js";
import update_cats from "./update/update_cats.js";
import reset_cats from "./update/reset_cats.js";
import two_translate_zoom from "./zoom/two_translate_zoom.js";
import update_view from "./update/update_view.js";
import save_matrix from "./matrix/save_matrix.js";
import brush_crop_matrix from "./matrix/brush_crop_matrix.js";
import run_zoom from "./zoom/run_zoom.js";
import d3_tip_custom from "./tooltip/d3_tip_custom.js";
import all_reorder from "./reorder/all_reorder.js";
import make_matrix_string from "./matrix/make_matrix_string.js";
import run_row_search from "./search/run_row_search.js";
import d3 from "d3";
// moved d3.slider to src
d3.slider = require('./d3.slider');
class Clustergrammer {
    params;
    config;
    constructor(args) {
        this.config = make_config(args);
        this.params = make_params(this.config);
        // set up zoom
        this.params.zoom_behavior = d3.behavior
            .zoom()
            .scaleExtent([
            1,
            this.params.viz.square_zoom * this.params.viz.zoom_ratio.x
        ])
            .on('zoom', () => {
            run_zoom(this);
        });
        this.params.zoom_behavior.translate([
            this.params.viz.clust.margin.left,
            this.params.viz.clust.margin.top
        ]);
        make_viz(this);
    }
    resize_viz() {
        d3.select(this.params.viz.viz_svg).style('opacity', 0.5);
        let wait_time = 500;
        if (this.params.viz.run_trans === true) {
            wait_time = 2500;
        }
        setTimeout(resize_viz, wait_time, this);
    }
    update_cats(cat_data) {
        update_cats(this, cat_data);
    }
    zoom(pan_dx, pan_dy, fin_zoom) {
        two_translate_zoom(this, pan_dx, pan_dy, fin_zoom);
    }
    d3_tip_custom() {
        // this allows external modules to have access to d3_tip
        return d3_tip_custom;
    }
    reorder(inst_rc, inst_order) {
        if (inst_order === 'sum') {
            inst_order = 'rank';
        }
        if (inst_order === 'var') {
            inst_order = 'rankvar';
        }
        all_reorder(this, inst_order, inst_rc);
    }
    export_matrix_string() {
        return make_matrix_string(this.params);
    }
    update_view(filter_type, inst_state) {
        update_view(this, filter_type, inst_state);
    }
    search_row(search_term) {
        const entities = this.params.network_data.row_nodes_names;
        run_row_search(this, search_term, entities);
    }
}
Clustergrammer.prototype.play_demo = play_demo;
Clustergrammer.prototype.ini_demo = ini_demo;
Clustergrammer.prototype.filter_viz_using_nodes = filter_viz_using_nodes;
Clustergrammer.prototype.filter_viz_using_names = filter_viz_using_names;
Clustergrammer.prototype.reset_cats = reset_cats;
Clustergrammer.prototype.save_matrix = save_matrix;
Clustergrammer.prototype.brush_crop_matrix = brush_crop_matrix;
export default Clustergrammer;
