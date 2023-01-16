module.exports = function run_segment(segment_data, inst_time, inst_segment) {
  const timer = setTimeout(inst_segment().run, inst_time, segment_data);

  // set up kill demo that will stop setTimeouts
  //////////////////////////////////////////////////
  // if (clear_timer){
  //   clearTimeout(timer);
  // }

  const inst_duration = inst_segment().get_duration();
  inst_time = inst_time + inst_duration;

  return inst_time;
};
