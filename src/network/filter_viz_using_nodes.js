import filter_network_using_new_nodes from "./filter_network_using_new_nodes.js";
import update_viz_with_network from "../update/update_viz_with_network.js";
export default (function filter_viz_using_nodes(new_nodes) {
    const new_network_data = filter_network_using_new_nodes(this.config, new_nodes);
    update_viz_with_network(this, new_network_data);
});
