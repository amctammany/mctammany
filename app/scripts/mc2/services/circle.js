'use strict';

angular.module('mctApp')
  .factory('Circle', function () {
    var Circle;

    Circle = function (x, y, radius) {
      this.x = x;
      this.y = y;
      this.radius = radius;
    };

    return Circle;
  });
