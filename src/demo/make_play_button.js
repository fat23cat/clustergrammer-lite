const d3 = require('d3');
const position_play_button = require('./position_play_button');

module.exports = function make_play_button(cgm) {
  const params = cgm.params;

  if (d3.select(params.root + ' .play_button').empty()) {
    const play_button = d3
      .select(params.root + ' .viz_svg')
      .append('g')
      .classed('play_button', true)
      .classed('running_demo', false);

    position_play_button(params);

    play_button
      .append('circle')
      .style('r', 45)
      .style('fill', 'white')
      .style('stroke', 'black')
      .style('stroke-width', '3px')
      .style('opacity', 0.5);

    play_button
      .append('path')
      .attr('d', function () {
        const tri_w = 40;
        const tri_h = 22;
        const tri_offset = 15;

        return (
          'M-' +
          tri_offset +
          ',-' +
          tri_h +
          ' l ' +
          tri_w +
          ',' +
          tri_h +
          ' l -' +
          tri_w +
          ',' +
          tri_h +
          ' z '
        );
      })
      .style('fill', 'black')
      .style('opacity', 0.5);

    // mouseover behavior
    play_button
      .on('mouseover', function () {
        d3.select(this).select('path').style('fill', 'red').style('opacity', 1);

        d3.select(this).select('circle').style('opacity', 1);
      })
      .on('mouseout', function () {
        d3.select(this)
          .select('path')
          .style('fill', 'black')
          .style('opacity', 0.5);
        d3.select(this).select('circle').style('opacity', 0.5);
      })
      .on('click', function () {
        // running from anonymous function to keep this defined correctly
        cgm.play_demo();
      });
  }
};
