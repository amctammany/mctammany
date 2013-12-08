'use strict';

angular.module('mctApp')
  .factory('Boundary', function (Vector3) {
    var Boundary = function (bounds) {
      this.minX = bounds.x;
      this.maxX = bounds.x + bounds.width;
      this.minY = bounds.y;
      this.maxY = bounds.y + bounds.height;
    
    };

    Boundary.prototype.checkPosition = function (pos) {
      if (pos.x < this.minX || pos.x > this.maxX || pos.y < this.minY || pos.y > this.maxY) {
        return false;
      }
      return true;
    };

    Boundary.prototype.getCorrection = function (pos) {
      var dx = 0;
      var dy = 0;
      if (pos.x < this.minX) {
        dx = this.minX - pos.x;
      }
      if (pos.x > this.maxX) {
        dx = this.maxX - pos.x;
      }
      if (pos.y < this.minY) {
        dy = this.minY - pos.y;
      }
      if (pos.y > this.maxY) {
        dy = this.maxY - pos.y;
      }
      return {x: dx, y: dy};
    };

    Boundary.prototype.checkParticle = function (particle) {
      var pos = particle.getCurrent();
      var normal;
      if (!this.checkPosition(pos)) {
        var correction = this.getCorrection(pos);
        if (pos.x < this.minX || pos.x > this.maxX) {
          normal = new Vector3(-1, 1, 1);
        }
        if (pos.y < this.minY || pos.y > this.maxY) {
          normal = new Vector3(1, -1, 1);
        }
        particle.bounce(normal);

      }
    
    };
    return Boundary;
  });
