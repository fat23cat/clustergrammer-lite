import d3 from "d3";
import all_reorder from "./all_reorder.js";
export default (function ini_cat_reorder(cgm) {
    const params = cgm.params;
    ['row', 'col'].forEach(function (inst_rc) {
        if (params.viz.show_categories[inst_rc]) {
            d3.selectAll(params.root + ' .' + inst_rc + '_cat_super').on('dblclick', function () {
                if (params.sim_mat) {
                    inst_rc = 'both';
                }
                d3.selectAll(params.root + ' .toggle_' + inst_rc + '_order .btn').classed('active', false);
                const order_id = this.__data__.replace('-', '_') + '_index';
                if (params.viz.sim_mat) {
                    all_reorder(cgm, order_id, 'row');
                    all_reorder(cgm, order_id, 'col');
                }
                else {
                    all_reorder(cgm, order_id, inst_rc);
                }
            });
        }
    });
});
