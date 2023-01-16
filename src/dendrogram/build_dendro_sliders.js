import build_single_dendro_slider from "./build_single_dendro_slider.js";
export default (function build_dendro_sliders(cgm) {
    build_single_dendro_slider(cgm, 'row');
    build_single_dendro_slider(cgm, 'col');
});
