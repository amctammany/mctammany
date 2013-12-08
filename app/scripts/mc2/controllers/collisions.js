'use strict';

angular.module('mctApp')
  .controller('CollisionsCtrl', function ($scope, World) {
    $scope.canvas = angular.element(document.getElementById('collisions-demo'))[0];
    $scope.canvas.width = 500;
    $scope.canvas.height = 500;
    $scope.ctx = $scope.canvas.getContext('2d');

    $scope.numBalls = 25;
    $scope.maxSpeed = 50;
    $scope.restitution = 1;

    $scope.world = new World();
    $scope.world.damping = 0;
    $scope.world.addBoundaries({
      x: 0,
      y: 0,
      width: $scope.canvas.width,
      height: $scope.canvas.height
    });
    $scope.animFrame = null;
    var Ball = function (x, y) {
      this.body = $scope.world.addParticle(x, y, 0, 1);
      this.draw($scope.ctx);
    };
    Ball.prototype.draw = function (ctx) {
      var pos = this.body.getCurrent();
      ctx.beginPath();
      ctx.fillStyle = 'black';
      ctx.arc(pos.x, pos.y, 10, 0, 6.28, 0);
      ctx.fill();
    };
    $scope.reset = function () {
      clearRect();
      $scope.balls = [];
      var ball, i, x, y, accX, accY;
      for (i = 0; i < $scope.numBalls; ++i) {
        x = Math.random() * $scope.canvas.width;
        y = Math.random() * $scope.canvas.height;
        accX = (Math.random() * 2 * $scope.maxSpeed) - $scope.maxSpeed;
        accY = (Math.random() * 2 * $scope.maxSpeed) - $scope.maxSpeed;

        ball = new Ball(x, y);
        $scope.balls.push(ball);
        ball.body.accelerate(accX, accY, 0);
      }
      animate();
    };
    $scope.reset();
    function clearRect() {
      $scope.ctx.clearRect(0, 0, $scope.canvas.width, $scope.canvas.height);
    }

    function animate (delta) {
      clearRect();
      $scope.world.simulate(0.2);
      $scope.balls.forEach(function (ball) {
        ball.draw($scope.ctx);
      });
      $scope.animFrame = window.requestAnimationFrame(animate);
    }
  });
