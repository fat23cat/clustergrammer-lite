import make_play_button from "./make_play_button.js";
import make_demo_text_containers from "./make_demo_text_containers.js";
export default (function ini_demo() {
    const cgm = this;
    const params = cgm.params;
    make_play_button(cgm);
    const demo_text_size = 30;
    make_demo_text_containers(params, demo_text_size);
});
