'use strict';

angular.module('mctApp')
  .factory('Point', function () {
    var Point;

    Point = function (x, y) {
      this.x = x;
      this.y = y;
    };

    return Point;
  });
