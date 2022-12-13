module.exports = function get_max_tree_distance(dm) {
  var max_distance_in_dm = 0;

  dm.forEach(function (row) {
    row.forEach(function (inst_val) {
      if (isFinite(inst_val)) {
        if (inst_val > max_distance_in_dm) {
          max_distance_in_dm = inst_val;
        }
      }
    });
  });

  return max_distance_in_dm;
};
