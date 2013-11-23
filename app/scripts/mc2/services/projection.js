'use strict';

angular.module('mctApp')
  .factory('Projection', function () {
    var Projection;

    Projection = function (min, max) {
      this.min = min;
      this.max = max;
    };

    Projection.prototype.overlaps = function (projection) {
      return this.max > projection.min && projection.max > this.min;
    };

    Projection.prototype.getOverlap = function (projection) {
      var overlap;
      if (!this.overlaps(projection)) { return 0; }
      if (this.max > projection.max) {
        overlap = projection.max - this.min;
      } else {
        overlap = this.max - projection.min;
      }
      return overlap;

    };

    return Projection;
  });
