const distances = require('./distance');

function KMeans(centroids) {
  this.centroids = centroids || [];
}

KMeans.prototype.randomCentroids = function (points, k) {
  const centroids = points.slice(0); // copy
  centroids.sort(function () {
    return Math.round(Math.random()) - 0.5;
  });
  return centroids.slice(0, k);
};

KMeans.prototype.classify = function (point, distance) {
  let min = Infinity;
  let index = 0;

  distance = distance || 'euclidean';
  if (typeof distance == 'string') {
    distance = distances[distance];
  }

  for (let i = 0; i < this.centroids.length; i++) {
    const dist = distance(point, this.centroids[i]);
    if (dist < min) {
      min = dist;
      index = i;
    }
  }

  return index;
};

KMeans.prototype.cluster = function (
  points,
  k,
  distance,
  snapshotPeriod,
  snapshotCb
) {
  k = k || Math.max(2, Math.ceil(Math.sqrt(points.length / 2)));

  distance = distance || 'euclidean';
  if (typeof distance == 'string') {
    distance = distances[distance];
  }

  this.centroids = this.randomCentroids(points, k);

  const assignment = new Array(points.length);
  const clusters = new Array(k);

  let i;
  let iterations = 0;
  let movement = true;
  while (movement) {
    // update point-to-centroid assignments
    for (i = 0; i < points.length; i++) {
      assignment[i] = this.classify(points[i], distance);
    }

    // update location of each centroid
    movement = false;
    for (let j = 0; j < k; j++) {
      const assigned = [];
      for (i = 0; i < assignment.length; i++) {
        if (assignment[i] == j) {
          assigned.push(points[i]);
        }
      }

      if (!assigned.length) {
        continue;
      }

      const centroid = this.centroids[j];
      const newCentroid = new Array(centroid.length);

      for (let g = 0; g < centroid.length; g++) {
        let sum = 0;
        for (i = 0; i < assigned.length; i++) {
          sum += assigned[i][g];
        }
        newCentroid[g] = sum / assigned.length;

        if (newCentroid[g] != centroid[g]) {
          movement = true;
        }
      }

      this.centroids[j] = newCentroid;
      clusters[j] = assigned;
    }

    if (snapshotCb && iterations++ % snapshotPeriod == 0) {
      snapshotCb(clusters);
    }
  }

  return clusters;
};

KMeans.prototype.toJSON = function () {
  return JSON.stringify(this.centroids);
};

KMeans.prototype.fromJSON = function (json) {
  this.centroids = JSON.parse(json);
  return this;
};

module.exports = KMeans;

module.exports.kmeans = function (vectors, k) {
  return new KMeans().cluster(vectors, k);
};
