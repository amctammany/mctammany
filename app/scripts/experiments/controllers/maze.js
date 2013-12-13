'use strict';

angular.module('mctApp')
  .controller('MazeCtrl', function ($scope) {
    $scope.rows = 10;
    $scope.columns = 10;

    $scope.mazes = ['hi', 'you7', 'foo'];

    var cellWidth, cellHeight;

    var defaultFill = 'lightsteelblue';
    var startFill = 'lightgreen';
    var endFill = 'red';
    $scope.init = function () {
    
      $scope.canvas = angular.element(document.getElementById('maze-canvas'))[0];
      $scope.ctx = $scope.canvas.getContext('2d');

      $scope.canvas.width = 700;
      $scope.canvas.height = 700;

    };


    function index (column, row) {
      return column + (row * $scope.columns);
    }

    var Cell = function (column, row) {
      this.column = column;
      this.row = row;
      this.fill = 'lightsteelblue';
      this.left = false;
      this.leftColor = 'black';
      this.right = false;
      this.rightColor = 'black';
      this.top = false;
      this.topColor = 'black';
      this.bottom = false;
      this.bottomColor = 'black';

    };

// Remove Wall {
    Cell.prototype.removeWall = function (side) {
      var neighbor;
      if (side === 'left') {
        neighbor = $scope.cells[index(this.column - 1, this.row)];
        if (neighbor) {
          this.left = this.left ? false : true;
          neighbor.right = neighbor.right ? false : true;
        }
      }
      if (side === 'right') {
        neighbor = $scope.cells[index(this.column + 1, this.row)];
        if (neighbor) {
          this.right = this.right ? false : true;
          neighbor.left = neighbor.left ? false : true;
        }
      }

      if (side === 'top') {
        neighbor = $scope.cells[index(this.column, this.row - 1)];
        if (neighbor) {
          this.top = this.top ? false : true;
          neighbor.bottom = neighbor.bottom ? false : true;
        }
      }

      if (side === 'bottom') {
        neighbor = $scope.cells[index(this.column, this.row + 1)];
        if (neighbor) {
          this.bottom = this.bottom ? false : true;
          neighbor.top = neighbor.top ? false : true;
        }
      }


    };
// }

// Highlight Side {
    Cell.prototype.highlightSide = function (side) {
      var neighbor;
      if (side === 'left') {
        this.leftColor = 'red';
        neighbor = $scope.cells[index(this.column - 1, this.row)];
        if (neighbor) {
          neighbor.rightColor = 'red';
        }
      }
      if (side === 'right') {
        this.rightColor = 'red';
        neighbor = $scope.cells[index(this.column + 1, this.row)];
        if (neighbor) {
          neighbor.leftColor = 'red';
        }
      }

      if (side === 'top') {
        this.topColor = 'red';
        neighbor = $scope.cells[index(this.column, this.row - 1)];
        if (neighbor) {
          neighbor.bottomColor = 'red';
        }
      }

      if (side === 'bottom') {
        this.bottomColor = 'red';
        neighbor = $scope.cells[index(this.column, this.row + 1)];
        if (neighbor) {
          neighbor.topColor = 'red';
        }
      }

    };
// }

// Draw {
    Cell.prototype.draw = function (ctx) {
      ctx.lineWidth = 1;
      if (!this.left) {
        ctx.strokeStyle = this.leftColor;
        ctx.beginPath();
        ctx.moveTo(this.column * cellWidth, this.row * cellHeight);
        ctx.lineTo(this.column * cellWidth, (this.row + 1) * cellHeight);
        ctx.closePath();
        ctx.stroke();
      }
      if (!this.right) {
        ctx.strokeStyle = this.rightColor;
        ctx.beginPath();
        ctx.moveTo((this.column + 1) * cellWidth, this.row * cellHeight);
        ctx.lineTo((this.column + 1)* cellWidth, (this.row + 1) * cellHeight);
        ctx.closePath();
        ctx.stroke();
      }
      if (!this.top) {
        ctx.strokeStyle = this.topColor;
        ctx.beginPath();
        ctx.moveTo(this.column * cellWidth, this.row * cellHeight);
        ctx.lineTo((this.column + 1) * cellWidth, this.row * cellHeight);
        ctx.closePath();
        ctx.stroke();
      }
      if (!this.bottom) {
        ctx.strokeStyle = this.bottomColor;
        ctx.beginPath();
        ctx.moveTo(this.column * cellWidth, (this.row + 1) * cellHeight);
        ctx.lineTo((this.column + 1) * cellWidth, (this.row + 1) * cellHeight);
        ctx.closePath();
        ctx.stroke();
      }
      if ($scope.start === this) {
        ctx.fillStyle = startFill;
      } else if ($scope.end === this) {
        ctx.fillStyle = endFill;
      } else {
        ctx.fillStyle = defaultFill;
      }
      ctx.beginPath();
      ctx.fillRect(this.column * cellWidth + 1, this.row * cellHeight + 1, cellWidth - 2, cellHeight - 2);
      ctx.closePath();

    };

// }



    $scope.generateBlankMaze = function () {
      var row, column, cell;
      cellWidth = $scope.canvas.width / $scope.columns;
      cellHeight = $scope.canvas.height / $scope.rows;

      $scope.cells = [];
      $scope.walls = [];

      $scope.cells = new Array($scope.rows * $scope.columns);
      for (row = 0; row < $scope.rows; ++row) {
        for (column = 0; column < $scope.columns; ++column) {
          cell = new Cell(column, row);
          $scope.cells[index(column, row)] = cell;
        }
      }
      draw();
    };


    $scope.handleMouseDown = function (e) {
      var column = Math.floor(e.offsetX / cellWidth);
      var row = Math.floor(e.offsetY / cellHeight);
      var cell = $scope.cells[index(column, row)];
      if ($scope.startSelection) {
        $scope.startSelection = false;
        return;
      }
      if ($scope.endSelection) {
        $scope.endSelection = false;
        return;
      }
      //cell.bottom = true;
      //$scope.cells[x][y+1].top = true;
      var dl = e.offsetX - (cell.column * cellWidth);
      var dr = (cell.column + 1) * cellWidth - e.offsetX;
      var dt = e.offsetY - (cell.row * cellHeight);
      var db = (cell.row + 1) * cellHeight - e.offsetY;
      var deltas = {
        left: dl,
        right: dr,
        top: dt,
        bottom: db
      };
      var side = $scope.findLowestDelta(deltas);
      cell.removeWall(side);
      console.log(cell);
      draw();
    };
    $scope.handleMouseMove = function (e) {
      var column = Math.floor(e.offsetX / cellWidth);
      var row = Math.floor(e.offsetY / cellHeight);
      var cell = $scope.cells[index(column, row)];

      if ($scope.startSelection) {
        $scope.start = cell;
      }
      if ($scope.endSelection) {
        $scope.end = cell;
      }

      draw();
    
    };

    var draw = function draw () {
      $scope.ctx.clearRect(0, 0, $scope.canvas.width, $scope.canvas.height);
      $scope.cells.forEach(function (cell) {
        cell.draw($scope.ctx);
      });
    };

    $scope.addStart = function () {
      $scope.startSelection = true;
    };

    $scope.addEnd = function () {
      $scope.endSelection = true;
    };
    $scope.findLowestDelta = function (deltas) {
      var lowest = Object.keys(deltas).reduce(function (previous, key) {
        var d = deltas[key];
        if (d < deltas[previous]) {
          return key;
        }
        return previous;
      });
      return lowest;
    };

  });
