const file_saver = require('../screenshot/file_saver');
const make_matrix_string = require('./make_matrix_string');

module.exports = function save_matrix() {
  const saveAs = file_saver();

  const params = this.params;

  const matrix_string = make_matrix_string(params);

  const blob = new Blob([matrix_string], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, 'clustergrammer.txt');
};
