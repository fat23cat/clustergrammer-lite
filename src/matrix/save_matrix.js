import file_saver from "../screenshot/file_saver.js";
import make_matrix_string from "./make_matrix_string.js";
export default (function save_matrix() {
    const saveAs = file_saver();
    const params = this.params;
    const matrix_string = make_matrix_string(params);
    const blob = new Blob([matrix_string], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'clustergrammer.txt');
});
