'use strict';

angular.module('mctApp')
  .factory('Polygon', function () {
    var Polygon;

    Polygon = function (points) {
      this.points = points;
    };
  
    return Polygon;
  });
