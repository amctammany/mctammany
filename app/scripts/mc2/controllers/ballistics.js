'use strict';

angular.module('mctApp')
  .controller('BallisticsCtrl', function ($scope, Particle, Vector3) {
    $scope.canvas = angular.element(document.getElementById('ballistics-demo'))[0];
    $scope.canvas.width = 800;
    $scope.canvas.height = 500;
    $scope.ctx = $scope.canvas.getContext('2d');
    $scope.ctx.fillStyle = '#ddd';
    $scope.ctx.fillRect(0, 0, 800, 500);
    $scope.position = {x: 10, y: 400};
    $scope.acceleration = {x: 30, y: -40};
    $scope.gravity = {x: 0, y: 1};
    $scope.animFrame = null;

    var Ball = function () {
      this.reset();
      clearRect();
      this.draw($scope.ctx);
    };
    Ball.prototype.reset = function () {
      this.particle = new Particle('world', $scope.position.x, $scope.position.y);
      this.particle.addForce(new Vector3($scope.acceleration.x, $scope.acceleration.y, 0));
    };
    Ball.prototype.checkBounds = function () {
      if (this.particle.current.x < 0 || this.particle.current.x > 800 || this.particle.current.y < 0 || this.particle.current.y > 500) {
        this.reset();
        return true;
      }
      else {
        return false;
      }
    };
    Ball.prototype.update = function (delta) {
      if (this.checkBounds()) { this.reset(); }
      this.particle.addForce(new Vector3($scope.gravity.x, $scope.gravity.y, 0));
      this.particle.integrate(delta);
      this.draw($scope.ctx);
    };
    Ball.prototype.draw = function (ctx) {
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(this.particle.current.x, this.particle.current.y, 5, 0,  6.24, 0);
      //ctx.fillRect(this.particle.current.x, this.particle.current.y, 10, 10);
      ctx.closePath();
      ctx.fill();
    };
    $scope.ball = new Ball();
    $scope.fire = function () {
      if ($scope.animFrame) {
        window.cancelAnimationFrame($scope.animFrame);
        $scope.animFrame = null;
        return;
      }
      $scope.ball.reset();
      $scope.animFrame = window.requestAnimationFrame(animate);
    };
    function clearRect () {
      $scope.ctx.clearRect(0, 0, 800, 500);
      $scope.ctx.fillStyle = 'red';
      $scope.ctx.fillRect($scope.position.x - 5, $scope.position.y - 5, 10, 10);
    }
    function animate (delta) {
      clearRect();
      $scope.ball.update(0.3);
      $scope.animFrame = window.requestAnimationFrame(animate);
    }
  });
