'use strict';

angular.module('mctApp')
  .controller('ClothCtrl', function ($scope, World, Vector3) {
    $scope.canvas = angular.element(document.getElementById('cloth-demo'))[0];
    $scope.canvas.width = 500;
    $scope.canvas.height = 500;
    $scope.ctx = $scope.canvas.getContext('2d');
    $scope.ctx.fillStyle = '#ddd';
    $scope.ctx.fillRect(0, 0, 500, 500);

    $scope.rows = 15;
    $scope.columns = 15;
    $scope.world = new World();
    $scope.world.addGravity(0, 0.1, 0);

    $scope.points = [];
    $scope.constraints = [];

    $scope.animFrame = null;

    var selectedPoint = null;
    var Point = function (x, y) {
      this.body = $scope.world.addParticle(x+75, y+50, 0, 1);
      this.fill = 'black';
      //this.draw($scope.ctx);
    };

    Point.prototype.draw = function (ctx) {
      ctx.fillStyle = this.fill;
      ctx.beginPath();
      ctx.arc(this.body.getCurrent().x, this.body.getCurrent().y, 3, 0, 6.24, 0);
      ctx.closePath();
      ctx.fill();
    };

    var Constraint = function (p1, p2) {
      this.body = $scope.world.addSpringForceGenerator(p1, p2, 125);
      //this.draw($scope.ctx);
    };

    Constraint.prototype.draw = function (ctx) {
      var p1 = this.body.p1.getCurrent();
      var p2 = this.body.p2.getCurrent();
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    };
    var i, j;
    var dx = ($scope.canvas.width - 100) / $scope.rows;
    var dy = ($scope.canvas.height - 200) / $scope.columns;
    for (i = 0; i < $scope.columns; ++i) {
      $scope.points[i] = [];
      for (j = 0; j < $scope.rows; ++j) {
        $scope.points[i].push(new Point(i * dx, j * dy));
      }
    }

    var p1, p2;
    for (i = 0; i < $scope.columns; ++i) {
      for (j = 0; j < $scope.columns; ++j) {
        if (i > 0) {
          p1 = $scope.points[i - 1][j].body;
          p2 = $scope.points[i][j].body;
          $scope.constraints.push(new Constraint(p1, p2));
        }
        if (j > 0) {
          p1 = $scope.points[i][j - 1].body;
          p2 = $scope.points[i][j].body;
          $scope.constraints.push(new Constraint(p1, p2));
        
        }
      }
    }
    $scope.points[0][0].body.inverseMass = 0;
    $scope.points[$scope.columns - 1][0].body.inverseMass = 0;



    function animate (delta) {
      $scope.ctx.clearRect(0, 0, 500, 500);
      var i, j, pt, constraint;
      for (i = 0; i < 5; ++i) {
        $scope.world.simulate(0.1);
      }

      $scope.constraints.forEach(function (c) {
        c.draw($scope.ctx);
      });
      for (i = 0; i < $scope.columns; ++i) {
        for (j = 0; j < $scope.columns; ++j) {
          pt = $scope.points[i][j];
          pt.draw($scope.ctx);
        }
      }
      $scope.animFrame = window.requestAnimationFrame(animate);
    }

    animate();

    function getClosestPoint (x, y) {
      var pt = new Vector3(x, y, 0);
      var min = 100;
      var closestPoint = null;
      var rows = $scope.rows;
      var columns = $scope.columns;
      var points = $scope.points;
      var dist, i, j;

      for (i = 0; i < columns; ++i) {
        for (j = 0; j < rows; ++j) {
          dist = pt.sub(points[i][j].body.getCurrent()).getMagnitude();
          if (dist < min) {
            min = dist;
            closestPoint = points[i][j];
          }
        }
      }
      return closestPoint;
    }

    $scope.handleMouseDown = function (e) {
      var x = e.offsetX;
      var y = e.offsetY;
      selectedPoint = getClosestPoint(x, y);
      selectedPoint.fill = 'red';
      selectedPoint.body.inverseMass = 0;
    };
    $scope.handleMouseMove = function (e) {
      if (!selectedPoint) {return;}
      var x = e.offsetX;
      console.log(e.offsetX);
      var y = e.offsetY;
      console.log(e.offsetY);

      selectedPoint.body.moveTo(x, y, 0);
    };
    $scope.handleMouseUp = function (e) {
      selectedPoint = null;
    };

  });
