'use strict';

angular.module('mctApp')
  .controller('SpringCtrl', function ($scope, Particle, Spring, Vector3) {
    $scope.canvas = angular.element(document.getElementById('spring-demo'))[0];
    $scope.canvas.width = 800;
    $scope.canvas.height = 500;
    $scope.ctx = $scope.canvas.getContext('2d');
    $scope.ctx.fillStyle = '#ddd';
    $scope.ctx.fillRect(0, 0, 800, 500);


    var Ball = function (x, y, fill) {
      this.particle = new Particle(x, y, 0);
      this.fill = fill;
      this.draw($scope.ctx);
    };
    Ball.prototype.reset = function () {
    };
    Ball.prototype.checkBounds = function () {
      if (this.particle.position.x < 0 || this.particle.position.x > 800 || this.particle.position.y < 0 || this.particle.position.y > 500) {
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
      ctx.fillStyle = this.fill;
      ctx.beginPath();
      ctx.arc(this.particle.position.x, this.particle.position.y, 15, 0,  6.24, 0);
      //ctx.fillRect(this.particle.position.x, this.particle.position.y, 10, 10);
      ctx.closePath();
      ctx.fill();
    };

    var SpringObj = function (p1, p2, rest, k) {
      this.spring = new Spring(p1, p2, rest, k);
      this.draw($scope.ctx);
    };

    SpringObj.prototype.draw = function (ctx) {
      ctx.beginPath();
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 3;
      ctx.moveTo(this.spring.p1.position.x, this.spring.p1.position.y);
      ctx.lineTo(this.spring.p2.position.x, this.spring.p2.position.y);
      ctx.stroke();
    };
    $scope.ball1 = new Ball(250, 100, 'blue');
    $scope.ball2 = new Ball(400, 100, 'green');
    $scope.spring = new SpringObj($scope.ball1.particle, $scope.ball2.particle, 100, 0.1);
    function clearRect () {
      $scope.ctx.clearRect(0, 0, 800, 500);
      //$scope.ctx.fillStyle = 'red';
      //$scope.ctx.fillRect($scope.position.x - 5, $scope.position.y - 5, 10, 10);
    }
    function animate (delta) {
      clearRect();
      $scope.ball1.particle.integrate(0.3);
      $scope.ball2.particle.integrate(0.3);
      $scope.ball1.draw($scope.ctx);
      $scope.ball2.draw($scope.ctx);
      $scope.spring.draw($scope.ctx);
      $scope.spring.spring.update(0.3);
      $scope.animFrame = window.requestAnimationFrame(animate);
    }
    animate();

  });
