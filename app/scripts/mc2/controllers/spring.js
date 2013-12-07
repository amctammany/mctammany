'use strict';

angular.module('mctApp')
  .controller('SpringCtrl', function ($scope, World, Vector3) {
    $scope.canvas = angular.element(document.getElementById('spring-demo'))[0];
    $scope.canvas.width = 800;
    $scope.canvas.height = 500;
    $scope.ctx = $scope.canvas.getContext('2d');
    $scope.ctx.fillStyle = '#ddd';
    $scope.ctx.fillRect(0, 0, 800, 500);

    $scope.world = new World();


    var Ball = function (x, y, fill) {
      this.body = $scope.world.addParticle(x, y, 0, 1);
      this.fill = fill;
      this.draw($scope.ctx);
    };
    Ball.prototype.checkBounds = function () {
      if (this.body.getCurrent().x < 0 || this.body.getCurrent().x > 800 || this.body.position.y < 0 || this.body.position.y > 500) {
        this.reset();
        return true;
      }
      else {
        return false;
      }
    };
    Ball.prototype.draw = function (ctx) {
      ctx.fillStyle = this.fill;
      ctx.beginPath();
      ctx.arc(this.body.getCurrent().x, this.body.getCurrent().y, 15, 0,  6.24, 0);
      //ctx.fillRect(this.body.getCurrent().x, this.body.getCurrent().y, 10, 10);
      ctx.closePath();
      ctx.fill();
    };

    var SpringObj = function (p1, p2, k, rest) {
      this.spring = $scope.world.addSpringForceGenerator(p1, p2, k, rest);
      this.draw($scope.ctx);
    };

    SpringObj.prototype.draw = function (ctx) {
      ctx.beginPath();
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 3;
      ctx.moveTo(this.spring.p1.getCurrent().x, this.spring.p1.getCurrent().y);
      ctx.lineTo(this.spring.p2.getCurrent().x, this.spring.p2.getCurrent().y);
      ctx.stroke();
    };
    $scope.ball1 = new Ball(250, 100, 'blue');
    $scope.ball2 = new Ball(400, 100, 'green');
    $scope.spring = new SpringObj($scope.ball1.body, $scope.ball2.body, 10, 100);
    function clearRect () {
      $scope.ctx.clearRect(0, 0, 800, 500);
      //$scope.ctx.fillStyle = 'red';
      //$scope.ctx.fillRect($scope.getCurrent().x - 5, $scope.getCurrent().y - 5, 10, 10);
    }
    function animate (delta) {
      clearRect();
      $scope.world.simulate(0.2);
      $scope.ball1.draw($scope.ctx);
      $scope.ball2.draw($scope.ctx);
      $scope.spring.draw($scope.ctx);
      $scope.animFrame = window.requestAnimationFrame(animate);
    }
    animate();

  });
