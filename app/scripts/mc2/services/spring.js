'use strict';

angular.module('mctApp')
  .factory('Spring', function () {
    var Spring = function (p1, p2, rest, k) {
      this.p1 = p1;
      this.p2 = p2;
      this.rest = rest;
      this.sqRest = rest * rest;
      this.k = k;
    };

    Spring.prototype.getLength = function () {
      var length = this.p1.position.sub(this.p2.position).getMagnitude();
      return length;
    };
    Spring.prototype.getDirection = function () {
      var dir = this.p2.position.sub(this.p1.position).normalize();
      return dir;
    };

    Spring.prototype.update = function (del) {
      var length = this.getLength();
      var dir = this.getDirection();
      var delta = this.p2.position.sub(this.p1.position);
      var d = delta.squaredLength();
      var diff = (d - this.sqRest) / ((this.sqRest + d) * 2);
      var magnitude = Math.abs((length - this.rest) / this.rest) * this.k;

      this.p1.addForce(dir.mul(diff * 0.5));
      this.p2.addForce(dir.mul(diff * -0.5 ));
    };

    return Spring;
  });
