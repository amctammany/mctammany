'use strict';

angular.module('mctApp')
  .factory('BallDrop', function () {
    var BallDrop, Ball, Line, Projection, Shape, Vector;

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
      subtract: function (vector) {
        var v = new Vector();
        v.x = this.x - vector.x;
        v.y = this.y - vector.y;
        return v;
      },
      multiply: function (scalar) {
        var v = new Vector();
        v.x = this.x * scalar;
        v.y = this.y * scalar;
        return v;
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
// BallDrop {
    BallDrop = function (canvas) {
      this.canvas = canvas;
      this.canvas.width = 800;
      this.canvas.height = 500;
      this.ctx = canvas.getContext('2d');
      this.width = canvas.width;
      this.height = canvas.height;

      this.ball = new Ball();
      this.shapes = [this.ball];
      this.animFrame = window.requestAnimationFrame(this.update.bind(this));
    };

    BallDrop.prototype.startNewLine = function (x, y) {
      //if (this.animFrame) {window.cancelAnimationFrame(this.animFrame);}
      var line = new Line(x, y);
      this.shapes.push(line);
      //this.animFrame = window.requestAnimationFrame(this.update.bind(this));
      return line;
    };
    BallDrop.prototype.removeLine = function (line) {
      var index = this.shapes.indexOf(line);
      this.shapes.splice(line);
    };
    BallDrop.prototype.refreshBackground = function () {
      this.ctx.clearRect(0, 0, 800, 500);
    };

    BallDrop.prototype.render = function () {
      this.refreshBackground();
      this.detectCollisions();
      var ctx = this.ctx;
      this.ball.draw(ctx);
      this.shapes.map(function (shape) {
        shape.draw(ctx);
      });
    };

    BallDrop.prototype.detectCollisions = function () {
      var numShapes = this.shapes.length;
      var shape1, shape2;
      var i, j;
      for (i = 0; i < numShapes; i++) {
        for (j = 0; j < numShapes; j++) {
          if (i !== j) {
            shape1 = this.shapes[i];
            shape2 = this.shapes[j];

            if (shape1.collidesWith(shape2)) {
              shape1.color = 'red';
              shape2.color = 'red';
            }
          }
        }
      }
    };
    BallDrop.prototype.update = function (delta) {
      this.ball.integrate(0.05);
      if (this.ball.current.y > this.height) {this.ball.reset();}
      this.render();
      //this.animFrame = window.requestAnimationFrame(this.update.bind(this));
    };
// }

    Projection = function (min, max) {
      this.min = min;
      this.max = max;
    };
    Projection.prototype.overlaps = function (projection) {
      return this.max > projection.min && projection.max > this.min;
    };

    Shape = function () {
    
    };
    Shape.prototype.collidesWith = function (other) {
      var axes = this.getAxes().concat(other.getAxes());
      return !this.separationOnAxes(axes, other);
    };

    Shape.prototype.separationOnAxes = function (axes, shape) {
      var i;
      var axis;
      var proj1;
      var proj2;
      for (i = 0; i < axes.length; i++) {
        axis = axes[i];
        proj1 = shape.project(axis);
        proj2 = this.project(axis);

        if (! proj1.overlaps(proj2)) {
          return true;
        }

      }
    };

    function getPolygonPointClosestToCircle(polygon, circle) {
      var min = 10000;
      var length;
      var testPoint;
      var closestPoint;

      for (var i = 0; i < polygon.points.length; i++) {
        testPoint = polygon.points[i];
        length = Math.sqrt(Math.pow(testPoint.x - circle.current.x, 2) + Math.pow(testPoint.y - circle.current.y, 2));
        if (length < min) {
          min = length;
          closestPoint = testPoint;
        }
      }
      return closestPoint;

    }
    function polygonCollidesWithCircle(polygon, circle) {
      var min = 10000;
      var axes = polygon.getAxes();
      var closestPoint = getPolygonPointClosestToCircle(polygon, circle);
      var v1 = new Vector(circle.current.x, circle.current.y);
      var v2 = new Vector(closestPoint.x, closestPoint.y);

      axes.push(v1.subtract(v2).normalize());
      return !polygon.separationOnAxes(axes, circle);
    
    }
// Ball {
    Ball = function () {
      this.reset();
      this.radius = 5;
    };
    Ball.prototype = new Shape();
    Ball.prototype.reset = function () {
      this.current = new Vector(50, 10);
      this.previous = new Vector(50, 10);

      this.velocity = new Vector(0, 0);
      this.acceleration = new Vector(0, 15);
      this.color = 'black';
    };
    Ball.prototype.integrate = function (delta) {
      var position = this.current.multiply(2).subtract(this.previous).add(this.acceleration.multiply(delta * delta));
      this.previous = this.current.dup();
      this.current = position;
    };
    Ball.prototype.draw = function (ctx) {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.current.x, this.current.y, this.radius, 0, 6.28, 0);
      ctx.fill();
    };
    Ball.prototype.project = function (axis) {
      var scalars = [];
      var dotProduct = this.current.dot(axis);
      scalars.push(dotProduct);
      scalars.push(dotProduct + this.radius);
      scalars.push(dotProduct - this.radius);

      return new Projection(Math.min.apply(Math, scalars), Math.max.apply(Math, scalars));
    };
    Ball.prototype.collidesWith = function (shape) {
      var point;
      var length;
      var min = 10000;
      var v1;
      var v2;
      var edge;
      var perpendicular;
      var normal;
      var distance;
      var axes = shape.getAxes;
      if (axes === undefined) { // Circle
        distance = Math.sqrt(Math.pow(shape.x - this.x, 2) + Math.pow(shape.y - this.y, 2));
        return distance < Math.abs(this.radius + shape.radius);
      } else { // Polygon
        return polygonCollidesWithCircle(shape, this);
      }
    };
    Ball.prototype.getAxes = function () {
      return [];
    };
// }

// Line {
    Line = function (x, y) {
      this.start = new Vector(x, y);
      this.end = new Vector(x+1, y+1);
      this.points = [this.start, this.end];
      this.color = 'black';
    
    };

    Line.prototype = new Shape();

    Line.prototype.project = function (axis) {
      var v = new Vector();
      var scalars = [];
      this.points.forEach( function (point) {
        v.x = point.x;
        v.y = point.y;
        scalars.push(v.dot(axis));
      });
      return new Projection(Math.min.apply(Math, scalars), Math.max.apply(Math, scalars));
    };
    Line.prototype.getAxes = function () {
      return [this.start.edge(this.end).normal()];
    };
    Line.prototype.draw = function (ctx) {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = this.color;
      ctx.moveTo(this.start.x, this.start.y);
      ctx.lineTo(this.end.x, this.end.y);
      ctx.closePath();
      ctx.stroke();
    };

    Line.prototype.length = function () {
      var v = this.end.subtract(this.start);
      return v.normalize();
    };

// }
    return BallDrop;
  });
