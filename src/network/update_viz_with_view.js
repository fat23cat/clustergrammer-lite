import d3 from "d3";
import make_network_using_view from "./make_network_using_view.js";
import disable_sidebar from "../sidebar/disable_sidebar.js";
import update_viz_with_network from "../update/update_viz_with_network.js";
export default (function update_viz_with_view(cgm, requested_view) {
    disable_sidebar(cgm.params);
    // make new_network_data by filtering the original network data
    const new_network_data = make_network_using_view(cgm.config, cgm.params, requested_view);
    // reset crop button
    d3.select(cgm.params.root + ' .crop_button')
        .style('color', '#337ab7')
        .classed('fa-crop', true)
        .classed('fa-undo', false)
        .classed('active_cropping', false);
    // reset dendrogram filtering when updating with a new view
    // e.g. with the row filter sliders
    ['row', 'col'].forEach(function (inst_rc) {
        // set class to reflect that no filtering was ran
        d3.select(cgm.params.root + ' .' + inst_rc + '_dendro_icons_group').classed('ran_filter', false);
        // display all crop buttons when cropping has not been done
        d3.select(cgm.params.root + ' .' + inst_rc + '_dendro_icons_container').style('display', 'block');
    });
    update_viz_with_network(cgm, new_network_data);
});
