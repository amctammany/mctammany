'use strict';

angular.module('mctApp')
  .factory('Spring', function () {
    var Spring = function (p1, p2, k, rest) {
      this.p1 = p1;
      this.p2 = p2;
      this.rest = (rest === undefined) ? p2.getCurrent().sub(p1.getCurrent()).getMagnitude() : rest;
      this.sqRest = this.rest * this.rest;
      this.k = k;
    };

    Spring.prototype.getLength = function () {
      var length = this.p1.getCurrent().sub(this.p2.getCurrent()).getMagnitude();
      return length;
    };
    Spring.prototype.getDirection = function () {
      var dir = this.p2.getCurrent().sub(this.p1.getCurrent()).normalize();
      return dir;
    };

    Spring.prototype.update = function (del) {
      var length = this.getLength();
      var dir = this.getDirection();
      var delta = this.p2.getCurrent().sub(this.p1.getCurrent());
      var d = delta.squaredLength();
      var diff = (d - this.sqRest) / ((this.sqRest + d) * (this.p1.inverseMass + this.p2.inverseMass) ) * this.k;
      var magnitude = ((length - this.rest) / this.rest ) * this.k;

      this.p1.addForce(dir.mul(diff * 0.5));
      this.p2.addForce(dir.mul(diff * -0.5 ));
    };

    return Spring;
  });
