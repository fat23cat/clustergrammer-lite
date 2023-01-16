import make_dendro_triangles from "./make_dendro_triangles.js";
export default (function (cgm, inst_rc, inst_index) {
    const params = cgm.params;
    if (inst_rc === 'row') {
        params.group_level.row = inst_index;
    }
    else if (inst_rc === 'col') {
        params.group_level.col = inst_index;
    }
    const is_change_group = true;
    make_dendro_triangles(cgm, inst_rc, is_change_group);
});
