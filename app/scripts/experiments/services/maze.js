'use strict';

angular.module('mctApp')
  .factory('Maze', function () {
    var Maze = function (canvas) {
    
      if (canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
      }
    };

    return Maze;


  });
