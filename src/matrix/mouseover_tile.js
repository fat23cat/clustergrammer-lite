const d3 = require('d3');

module.exports = function mouseover_tile(
  params,
  inst_selection,
  tip,
  inst_arguments
) {
  const inst_data = inst_arguments[0];
  d3.select(inst_selection).classed('hovering', true);
  ['row', 'col'].forEach(function (inst_rc) {
    d3.selectAll(params.root + ' .' + inst_rc + '_label_group text').style(
      'font-weight',
      function (d) {
        let font_weight;
        const inst_found = (inst_data[inst_rc + '_name'] || '') === d.name;
        if (inst_found) {
          font_weight = 'bold';
        } else {
          font_weight = 'normal';
        }
        return font_weight;
      }
    );
  });
  dispatchEvent(
    new CustomEvent('TILE_MOUSEOVER', {
      detail: {
        tile: inst_data,
        rect: inst_selection.getBoundingClientRect()
      }
    })
  );
};
