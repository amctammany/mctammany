'use strict';

angular.module('mctApp')
  .factory('MTV', function () {
    var MTV;

    MTV = function (axis, overlap) {
      this.axis = axis; // Vector
      this.overlap = overlap; // Scalar
    
    };

    return MTV;
  
  });
