const d3 = require('d3');

module.exports = function demo_text(params, text, read_duration) {
  const split_text = text.split('\n');

  if (split_text.length < 3) {
    split_text.push('');
  }

  d3.select(params.root + ' .demo_group')
    .style('opacity', 0)
    .transition()
    .duration(250)
    .style('opacity', 1)
    .transition()
    .duration(250)
    .delay(read_duration)
    .style('opacity', 0);

  for (let i = 0; i < split_text.length; i++) {
    const inst_text_num = i + 1;

    // make text box
    //////////////////
    const inst_text_obj = d3
      .select(params.root + ' .demo_group')
      .select('#text_' + inst_text_num)
      .text(split_text[i]);
    const bbox = inst_text_obj[0][0].getBBox();

    const box_opacity = 0.9;

    const tmp_fs = Number(
      d3
        .select('.demo_group')
        .select('text')
        .style('font-size')
        .replace('px', '')
    );
    const shift_height = tmp_fs * 1.3;

    d3.select(params.root + ' .demo_group')
      .select('.rect_' + inst_text_num)
      .style('fill', 'white')
      .attr('width', bbox.width + 20)
      .attr('height', bbox.height)
      .attr('x', -10)
      .attr('y', bbox.y + i * shift_height)
      .style('opacity', box_opacity);
  }
};
