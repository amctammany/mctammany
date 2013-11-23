'use strict';

angular.module('mctApp')
  .factory('Vector', function () {
    var Vector;

    Vector = function (x, y) {
      this.x = x;
      this.y = y;
    };

    Vector.prototype = {
      getMagnitude: function () {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
      },
      add: function (vector) {
        var v = new Vector();
        v.x = this.x + vector.x;
        v.y = this.y + vector.y;
        return v;
      },
      iadd: function (vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
      },
      sub: function (vector) {
        var v = new Vector();
        v.x = this.x - vector.x;
        v.y = this.y - vector.y;
        return v;
      },
      isub: function (vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
      },
      mul: function (scalar) {
        var v = new Vector();
        v.x = this.x * scalar;
        v.y = this.y * scalar;
        return v;
      },
      imul: function (scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
      },
      div: function (scalar) {
        if (!scalar) {return;}
        var v = new Vector();
        v.x = this.x / scalar;
        v.y = this.y / scalar;
        return v;
      },
      idiv: function (scalar) {
        this.x /= scalar;
        this.y /= scalar;
        return this;
      },
      dot: function (vector) {
        return this.x * vector.x + this.y * vector.y;
      },
      edge: function (vector) {
        return this.subtract(vector);
      },
      perpendicular: function () {
        var v = new Vector();
        v.x = this.y;
        v.y = 0 - this.x;
        return v;
      },
      normalize: function () {
        var v = new Vector(0, 0);
        var m = this.getMagnitude();
        if (m !== 0) {
          v.x = this.x / m;
          v.y = this.y / m;
        }
        return v;
      },
      normal: function () {
        var p = this.perpendicular();
        return p.normalize();
      },
      dup: function () {
        return new Vector(this.x, this.y);
      },
    };

    return Vector;
  });
