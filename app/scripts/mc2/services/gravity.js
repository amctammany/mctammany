'use strict';

angular.module('mctApp')
  .factory('Gravity', function (Vector3) {
    var Gravity = function (x, y, z) {
      this.acceleration = new Vector3(x, y, z);
    };

    return Gravity;

  });
