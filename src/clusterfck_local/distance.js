module.exports = {
  euclidean: function (v1, v2) {
    let total = 0;
    for (let i = 0; i < v1.length; i++) {
      total = total + Math.pow(v2[i] - v1[i], 2);
    }
    return Math.sqrt(total);
  },
  manhattan: function (v1, v2) {
    let total = 0;
    for (let i = 0; i < v1.length; i++) {
      total = total + Math.abs(v2[i] - v1[i]);
    }
    return total;
  },
  max: function (v1, v2) {
    let max = 0;
    for (let i = 0; i < v1.length; i++) {
      max = Math.max(max, Math.abs(v2[i] - v1[i]));
    }
    return max;
  }
};
