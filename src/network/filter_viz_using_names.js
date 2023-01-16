import filter_network_using_new_nodes from "./filter_network_using_new_nodes.js";
import update_viz_with_network from "../update/update_viz_with_network.js";
import utils from "../Utils_clust.js";
export default (function filter_viz_using_names(names, external_cgm = false) {
    // names is an object with row and column names that will be used to filter
    // the matrix
    let cgm;
    if (external_cgm === false) {
        cgm = this;
    }
    else {
        cgm = external_cgm;
    }
    const config = cgm.config;
    const new_nodes = {};
    let found_nodes;
    ['row', 'col'].forEach(function (inst_rc) {
        const orig_nodes = JSON.parse(JSON.stringify(config.network_data[inst_rc + '_nodes']));
        if (utils.has(names, inst_rc)) {
            if (names[inst_rc].length > 0) {
                const inst_names = names[inst_rc];
                found_nodes = (orig_nodes || []).filter((d) => (inst_names || []).some((name) => d.name.toLowerCase().includes(name.toLowerCase())));
                if (!found_nodes.length) {
                    found_nodes = [
                        {
                            name: '',
                            row_index: 0
                        }
                    ];
                }
            }
            else {
                found_nodes = orig_nodes;
            }
        }
        else {
            found_nodes = orig_nodes;
        }
        new_nodes[inst_rc + '_nodes'] = found_nodes;
    });
    // keep backup of the nodes for resetting filtering
    const inst_row_nodes = cgm.params.network_data.row_nodes;
    const inst_col_nodes = cgm.params.network_data.col_nodes;
    const new_network_data = filter_network_using_new_nodes(cgm.config, new_nodes);
    // takes entire cgm object
    // last argument tells it to not preserve categoty colors
    update_viz_with_network(cgm, new_network_data);
    // only keep backup if previous number of nodes were larger than current number
    // of nodes
    if (inst_row_nodes.length > cgm.params.inst_nodes.row_nodes.length) {
        cgm.params.inst_nodes.row_nodes = inst_row_nodes;
    }
    if (inst_col_nodes.length > cgm.params.inst_nodes.col_nodes.length) {
        cgm.params.inst_nodes.col_nodes = inst_col_nodes;
    }
});
