'use strict';

angular.module('mctApp')
  .controller('MarblesCtrl', function ($scope) {
    $scope.canvas = angular.element(document.getElementById('marbles-canvas'))[0];
    $scope.ctx = $scope.canvas.getContext('2d');

    $scope.canvas.width = 600;
    $scope.canvas.height = 600;
    var marbleSize = 40;


    var colors = ['red', 'green', 'blue'];

    var Marble = function (column, row, type) {
      this.column = column;
      this.row = row;
      this.type = type;
      this.fill = colors[type];
      this.hidden = false;
      this.radius = marbleSize / 2;
    };

    Marble.prototype.hide = function () {
      this.hidden = true;
    };
    Marble.prototype.draw = function (ctx) {
      if (this.hidden) {return;}
      ctx.beginPath();
      ctx.fillStyle = this.fill;
      ctx.arc((this.column + 0.5) * marbleSize, (this.row + 0.5) * marbleSize, this.radius, 0, 6.28, 0);
      //ctx.fillRect(this.column * marbleSize, this.row * marbleSize, marbleSize, marbleSize);
      ctx.fill();
      ctx.closePath();
    };

    function index( column, row ) {
      return column + (row * $scope.maxColumn);
    }
    var Game = function () {
      this.reset();
    
    };
    Game.prototype.reset = function () {
      var column, row, marble, type;
      this.maxRow = Math.floor($scope.canvas.height / marbleSize);
      this.maxColumn = Math.floor($scope.canvas.width / marbleSize);
      $scope.maxColumn = this.maxColumn;
      this.maxIndex = this.maxRow * this.maxColumn;
      this.board = new Array(this.maxIndex);
      this.score = 0;
      this.neighborsFound = 0;
      this.neighborsBoard = null;

      for (column = 0; column < this.maxColumn; column++) {
        for (row = 0; row < this.maxRow; row++) {
        
          type = Math.floor(Math.random() * 3);
          marble = new Marble(column, row, type);
          this.board[index(column, row)] = marble;
        }
      }
    };

    Game.prototype.findNeighbors = function (column, row, type) {
      if (column >= this.maxColumn || column < 0 || row >= this.maxRow || row < 0) { return; }
      if (!this.board[index(column, row)]) { return; }

      var first = false;
      if (type === -1) {
        first = true;
        type = this.board[index(column, row)].type;
        this.neighborsFound = 0;
        this.neighborsBoard = new Array(this.maxIndex);
      }
      if (this.neighborsBoard[index(column, row)] === 1 || (!first && type !== this.board[index(column, row)].type)) {
        return;
      }
      this.neighborsBoard[index(column, row)] = 1;
      this.findNeighbors(column + 1, row, type);
      this.findNeighbors(column - 1, row, type);
      this.findNeighbors(column, row + 1, type);
      this.findNeighbors(column, row - 1, type);

      if (first === true &&  this.neighborsFound === 0) {
        return;
      }
      this.board[index(column, row)].hide();
      this.board[index(column, row)] = null;
      this.neighborsFound += 1;
      console.log(this.neighborsFound);
    };

    Game.prototype.shift = function () {
      var column, row, marble, fallDistance;
      // Shift Down
      for (column = 0; column < this.maxColumn; column++) {
        fallDistance = 0;
        for (row = this.maxRow - 1; row >= 0; row--) {
          if (!this.board[index(column, row)]) {
            fallDistance += 1;
          } else {
            if (fallDistance > 0) {
              marble = this.board[index(column, row)];
              marble.row += fallDistance;
              this.board[index(column, row + fallDistance)] = marble;
              this.board[index(column, row)] = null;
            }
          }
        }
      }

      // Shift Left
      fallDistance = 0;
      for (column = 0; column < this.maxColumn; column++) {
        if (!this.board[index(column, this.maxRow - 1)]) {
          fallDistance += 1;
        } else {
          if (fallDistance > 0) {
            for (row = 0; row < this.maxRow; row++) {
              marble = this.board[index(column, row)];
              if (!marble) {
                continue;
              }
              marble.column -= fallDistance;
              this.board[index(column - fallDistance, row)] = marble;
              this.board[index(column, row)] = null;
            }
          }
        }
      }
    };

    Game.prototype.victoryCheck = function () {
      var bonus = true;
      for(var column = this.maxColumn - 1; column >= 0; column--) {
        if (this.board[index(column, this.maxRow -1)]) {
          bonus = false;
        }
      }
      if (bonus) {
        this.score += 500;
      }
      if (bonus || !(this.checkNeighbors(0, this.maxRow - 1, -1))) {
        window.alert('Game over');
      }
    };

    Game.prototype.checkNeighbors = function (column, row, type) {
      if (column >= this.maxColumn || column < 0 || row >= this.maxRow || row < 0) {
        return false;
      }
      if (!this.board[index(column, row)]) {
        return false;
      }
      var checkType = this.board[index(column, row)].type;
      if (type === checkType) {
        return true;
      }
      return this.checkNeighbors(column + 1, row, checkType) || this.checkNeighbors(column, row - 1, this.board[index(column, row)].type);
    };


    $scope.newGame = function () {
      $scope.game = new Game();
      draw();
    };

    var draw = function () {
      $scope.ctx.clearRect(0, 0, $scope.canvas.width, $scope.canvas.height);
      $scope.game.board.forEach(function (marble) {
        if (!marble) {return;}
        marble.draw($scope.ctx);
      });
    };

    $scope.handleClick = function (e) {
      var column = Math.floor(e.offsetX / marbleSize);
      var row = Math.floor(e.offsetY / marbleSize);
      var game = $scope.game;
      game.findNeighbors(column, row, -1);
      game.score += (game.neighborsFound - 1) * (game.neighborsFound - 1);
      game.shift();
      game.victoryCheck();
      draw();
    };
  });
