'use strict';

angular.module('mctApp')
  .factory('BallDrop', function () {
    var BallDrop, Ball, Line, Projection, Shape, Vector, MinimumTranslationVector;

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
      zero: function () {
        this.x = 0;
        this.y = 0;
        return this;
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
      this.shapes = [];
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

    function collisionDetected (mtv) {
      return mtv.axis !== undefined || mtv.overlap !== 0;
    }
    BallDrop.prototype.detectCollisions = function () {
      var numShapes = this.shapes.length;
      var shape; //1, shape2;
      var i, j, mtv;
      for (i = 0; i < numShapes; i++) {
        shape = this.shapes[i];
        mtv = shape.collidesWith(this.ball);
        if (collisionDetected(mtv)) {
          this.ball.bounce(mtv, shape);
          shape.color = 'red';
          this.ball.color = 'red';
        } else {
          shape.color = 'black';
          this.ball.color = 'black';
        }
      }
        //for (j = 0; j < numShapes; j++) {
          //if (i !== j) {
            //shape1 = this.shapes[i];
            //shape2 = this.shapes[j];

            //mtv = shape1.collidesWith(shape2);
            //if (collisionDetected(mtv)) {
              //shape1.color = 'red';
              //shape2.color = 'red';
            //} else {
              //shape1.color = 'black';
              //shape2.color = 'black';
            //}
            ////if (shape1.collidesWith(shape2)) {
              ////shape1.color = 'red';
              ////shape2.color = 'red';
            ////}
          //}
        //}
      //}
    };
    BallDrop.prototype.reset = function () {
      this.ball.reset();
      this.shapes.forEach(function (shape) {
        shape.reset();
      });
    };
    BallDrop.prototype.update = function (delta) {
      this.ball.acceleration.y += 10;
      this.ball.integrate(0.04);
      if (this.ball.current.y > this.height) {this.reset();}
      this.render();
      this.animFrame = window.requestAnimationFrame(this.update.bind(this));
    };
// }

    Projection = function (min, max) {
      this.min = min;
      this.max = max;
    };
    Projection.prototype.overlaps = function (projection) {
      return this.max > projection.min && projection.max > this.min;
    };
    Projection.prototype.getOverlap = function (projection) {
      var overlap;
      if (!this.overlaps(projection)) { return 0; }
      if (this.max > projection.max) {
        overlap = projection.max - this.min;
      } else {
        overlap = this.max - projection.min;
      }
      return overlap;
    };

    MinimumTranslationVector = function (axis, overlap) {
      this.axis = axis;
      this.overlap = overlap;
    };
    Shape = function () {
    
      this.radius = undefined;
    };
    //Shape.prototype.collidesWith = function (other) {
      //var axes = this.getAxes().concat(other.getAxes());
      //return !this.separationOnAxes(axes, other);
    //};

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
    Shape.prototype.minimumTranslationVector = function (axes, shape) {
      var minimumOverlap = 10000;
      var overlap;
      var axisWithSmallestOverlap;
      var axis;
      var proj1;
      var proj2;
      for (var i = 0; i < axes.length; i++) {
        axis = axes[i];
        proj1 = shape.project(axis);
        proj2 = this.project(axis);
        overlap = proj1.getOverlap(proj2);

        if (overlap === 0) { // No Collision
          return {
            axis: undefined,
            overlap: 0
          };
        } else {
          if (overlap < minimumOverlap) {
            minimumOverlap = overlap;
            axisWithSmallestOverlap = axis;
          }
        }
      }
      return {
        axis: axisWithSmallestOverlap,
        overlap: minimumOverlap
      };
    
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

    function polygonCollidesWithPolygon (p1, p2) {
      var mtv1 = p1.minimumTranslationVector(p1.getAxes(), p2);
      var mtv2 = p1.minimumTranslationVector(p2.getAxes(), p2);

      if (mtv1.overlap === 0 && mtv2.overlap === 0) {
        return {
          axis: undefined,
          overlap: 0
        };
      } else {
        return mtv1.overlap < mtv2.overlap ? mtv1 : mtv2;
      }
    }
    function circleCollidesWithCircle (c1, c2) {
      var distance = Math.sqrt(Math.pow(c2.current.x - c1.current.x, 2) + Math.pow(c2.current.y - c1.current.y, 2));
      var overlap = Math.abs(c1.radius + c2.radius) - distance;
      return overlap < 0 ?
        new MinimumTranslationVector(undefined, 0) :
        new MinimumTranslationVector(undefined, overlap);
    }
    function polygonCollidesWithCircle(polygon, circle) {
      var min = 10000;
      var axes = polygon.getAxes();
      var closestPoint = getPolygonPointClosestToCircle(polygon, circle);
      var v1 = new Vector(circle.current.x, circle.current.y);
      var v2 = new Vector(closestPoint.x, closestPoint.y);

      axes.push(v1.subtract(v2).normalize());
      //return !polygon.separationOnAxes(axes, circle);
      return polygon.minimumTranslationVector(axes, circle);
    
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
      this.acceleration = new Vector(0, 5);
      this.color = 'black';
    };
    Ball.prototype.integrate = function (delta) {
      var position = this.current.multiply(2).subtract(this.previous).add(this.acceleration.multiply(delta * delta));
      this.previous = this.current.dup();
      this.current = position;
      this.acceleration.zero();
    };
    Ball.prototype.separate = function (mtv) {
      var dx, dy, velocityMagnitude, point;

      if (mtv.axis === undefined) { // Circle
        point = new Vector();
        velocityMagnitude = Math.sqrt(Math.pow(this.velocity.x, 2) + Math.pow(this.velocity.y, 2));
        point.x = this.velocity.x / velocityMagnitude;
        point.y = this.velocity.x / velocityMagnitude;
        mtv.axis = new Vector(point);
      
      }

      dx = mtv.axis.y * mtv.overlap;
      dy = mtv.axis.y * mtv.overlap;

      if ((dx < 0 && this.velocity.x < 0) || dx > 0 && this.velocity.x > 0) {
        dx = -dx;
      }
      if ((dy < 0 && this.velocity.y < 0) || dy > 0 && this.velocity.y > 0) {
        dy = -dy;
      }
      this.move(dx, dy);

    };
    Ball.prototype.checkMTVAxisDirection = function (mtv, shape) {
      if (mtv.axis === undefined) { return; }

      var c1 = this.current.dup();
      var c2 = shape.centroid();
      var cVector = c2.subtract(c1);
      var cNormal = cVector.normalize();

      if (cVector.dot(mtv.axis) > 0) {
        mtv.axis.x = -mtv.axis.x;
        mtv.axis.y = -mtv.axis.y;
      }
    };

    Ball.prototype.bounce = function (mtv, shape) {
      this.checkMTVAxisDirection(mtv, shape);
      var perpendicular, vdotl, ldotl;
      var velocityUnitVector = this.velocity.normalize();
      var velocityMagnitude = this.velocity.getMagnitude();

      var point = new Vector();
      if (mtv.axis !== undefined) {
        perpendicular = mtv.axis.perpendicular();
      } else {
        perpendicular = new Vector(-velocityUnitVector.y, velocityUnitVector.x);
      }
      vdotl = velocityUnitVector.dot(perpendicular);
      ldotl = perpendicular.dot(perpendicular);
      var dotProductRatio = vdotl / ldotl;
      point.x = 2 * dotProductRatio * perpendicular.x - velocityUnitVector.x;
      point.y = 2 * dotProductRatio * perpendicular.y - velocityUnitVector.y;
      this.separate(mtv);
      this.velocity.x = point.x * velocityMagnitude;
      this.velocity.y = point.y * velocityMagnitude;

    };
    Ball.prototype.move = function (dx, dy) {
      this.previous = this.current.dup();
      this.current.x += dx;
      this.current.y += dy;
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
      if (shape.radius === undefined) {
        return polygonCollidesWithCircle(shape, this);
      } else {
        return circleCollidesWithCircle(this, shape);
      }
    };
    //Ball.prototype.collidesWith = function (shape) {
      //var point;
      //var length;
      //var min = 10000;
      //var v1;
      //var v2;
      //var edge;
      //var perpendicular;
      //var normal;
      //var distance;
      //var axes = shape.getAxes();
      //if (axes === undefined) { // Circle
        //distance = Math.sqrt(Math.pow(shape.x - this.x, 2) + Math.pow(shape.y - this.y, 2));
        //return distance < Math.abs(this.radius + shape.radius);
      //} else { // Polygon
        //return polygonCollidesWithCircle(shape, this);
      //}
    //};
    Ball.prototype.getAxes = function () {
      return [];
    };
// }

// Line {
    Line = function (x, y) {
      this.start = new Vector(x, y);
      this.end = new Vector(x+1, y+1);
      this.points = [this.start, this.end];
      this.reset();
    
    };

    Line.prototype = new Shape();

    Line.prototype.centroid = function () {
      var length = this.length();
      return new Vector(this.start.x + length / 2, this.start.y + length / 2);
    };
    Line.prototype.reset = function () {
      this.color = 'black';
    };
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
    Line.prototype.collidesWith = function (shape) {
      if (shape.radius !== undefined) {
        return polygonCollidesWithCircle(this, shape);
      } else {
        return polygonCollidesWithPolygon(this, shape);
      }
    };
    //Line.prototype.collidesWith = function (shape) {
      //var axes = shape.getAxes();
      //if (axes.length === 0) {
        //return polygonCollidesWithCircle(this, shape);
      //} else {
        //axes.concat(this.getAxes());
        //return !this.separationOnAxes(axes, shape);
      //}
    //};
    Line.prototype.getAxes = function () {
      var axes = [];
      axes.push(this.start.edge(this.end).normal());
      axes.push(new Vector(0, 1));
      axes.push(new Vector(1, 0));
      return axes;
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
