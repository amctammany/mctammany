'use strict';

angular.module('mctApp')
  .factory('BallDrop', function () {
    var BallDrop, Ball, Line;
// BallDrop {
    BallDrop = function (canvas) {
      this.canvas = canvas;
      this.canvas.width = 800;
      this.canvas.height = 500;
      this.ctx = canvas.getContext('2d');
      this.width = canvas.width;
      this.height = canvas.height;

      this.lines = [];
      this.ball = new Ball();
      this.animFrame = window.requestAnimationFrame(this.update.bind(this));
    };

    BallDrop.prototype.startNewLine = function (x, y) {
      if (this.animFrame) {window.cancelAnimationFrame(this.animFrame);}
      var line = new Line(x, y);
      this.lines.push(line);
      return line;
    };
    BallDrop.prototype.removeLine = function (line) {
      var index = this.lines.indexOf(line);
      this.lines.splice(line);
    };
    BallDrop.prototype.refreshBackground = function () {
      this.ctx.clearRect(0, 0, 800, 500);
    };

    BallDrop.prototype.render = function () {
      this.refreshBackground();
      var ctx = this.ctx;
      this.ball.draw(ctx);
      console.log(this.lines.length);
      this.lines.map(function (line) {
        line.draw(ctx);
      });
    };

    BallDrop.prototype.update = function (delta) {
      this.ball.integrate(0.05);
      if (this.ball.current.e(2) > this.height) {this.ball.reset();}
      this.render();
      //this.animFrame = window.requestAnimationFrame(this.update.bind(this));
    };
// }


// Ball {
    Ball = function () {
      this.reset();
    };
    Ball.prototype.reset = function () {
      this.current = $V([50, 10]);
      this.previous = $V([50, 10]);

      this.velocity = $V([0, 0]);
      this.acceleration = $V([0, 15]);
    };
    Ball.prototype.integrate = function (delta) {
      var position = this.current.x(2).subtract(this.previous).add(this.acceleration.x(delta * delta));
      this.previous = this.current.dup();
      this.current = position;
    };
    Ball.prototype.draw = function (ctx) {
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(this.current.e(1), this.current.e(2), 5, 0, 6.28, 0);
      ctx.fill();
    };
// }

// Line {
    Line = function (x, y) {
      this.start = $V([x, y]);
      this.end = $V([x, y]);
    
    };

    Line.prototype.draw = function (ctx) {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.moveTo(this.start.e(1), this.start.e(2));
      ctx.lineTo(this.end.e(1), this.end.e(2));
      ctx.closePath();
      ctx.stroke();
    };

    Line.prototype.length = function () {
      var v = this.end.subtract(this.start);
      return v.modulus();
    };

// }
    return BallDrop;
  });
