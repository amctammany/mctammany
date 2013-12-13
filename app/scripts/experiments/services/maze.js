'use strict';

angular.module('mctApp')
  .factory('Maze', function () {

    var maxRows, maxColumns;
    var index = function index (column, row) {
      return column + (row * maxRows);
    };

    var findLowestDelta = function (deltas) {
      var lowest = Object.keys(deltas).reduce(function (previous, key) {
        var d = deltas[key];
        if (d < deltas[previous]) {
          return key;
        }
        return previous;
      });
      return lowest;
    };

    
    var Maze = function (canvas, columns, rows) {
      this.rows = rows;
      this.columns = columns;
      maxRows = rows;
      maxColumns = columns;

      this.defaultFill = 'lightsteelblue';
      this.startFill = 'lightgreen';
      this.endFill = 'red';
      if (canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');

        this.height = canvas.height;
        this.width = canvas.width;
      }
      this.reset();
    };

    Maze.prototype.findCell = function (column, row) {
      var cell = this.cells[index(column, row)];
      return cell;
    };

    Maze.prototype.reset = function () {
      var row, column, cell;
      this.cellWidth = this.canvas.width / this.columns;
      this.cellHeight = this.canvas.height / this.rows;


      this.cells = new Array(this.rows * this.columns);
      for (row = 0; row < this.rows; ++row) {
        for (column = 0; column < this.columns; ++column) {
          cell = this.addCell(column, row);
          this.cells[index(column, row)] = cell;
        }
      }
      this.draw();
    };

    Maze.prototype.addCell = function (column, row) {
      var cell = new Cell(column, row);
      cell.maze = this;
      //this.cells[index(column, row)] = cell;
      return cell;
    };

    Maze.prototype.draw = function () {
      var ctx = this.ctx;
      ctx.clearRect(0, 0, this.width, this.height);
      this.cells.forEach(function (cell) {
        cell.draw(ctx);
      });
    };

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
      var maze = this.maze;
      if (side === 'left') {
        neighbor = maze.cells[index(this.column - 1, this.row)];
        if (neighbor) {
          this.left = this.left ? false : true;
          neighbor.right = neighbor.right ? false : true;
        }
      }
      if (side === 'right') {
        neighbor = maze.cells[index(this.column + 1, this.row)];
        if (neighbor) {
          this.right = this.right ? false : true;
          neighbor.left = neighbor.left ? false : true;
        }
      }

      if (side === 'top') {
        neighbor = maze.cells[index(this.column, this.row - 1)];
        if (neighbor) {
          this.top = this.top ? false : true;
          neighbor.bottom = neighbor.bottom ? false : true;
        }
      }

      if (side === 'bottom') {
        neighbor = maze.cells[index(this.column, this.row + 1)];
        if (neighbor) {
          this.bottom = this.bottom ? false : true;
          neighbor.top = neighbor.top ? false : true;
        }
      }


    };
// }

// Draw {
    Cell.prototype.draw = function (ctx) {
      ctx.lineWidth = 1;
      var cellWidth = this.maze.cellWidth;
      var cellHeight = this.maze.cellHeight;
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
      if (this.maze.start === this) {
        ctx.fillStyle = this.maze.startFill;
      } else if (this.maze.end === this) {
        ctx.fillStyle = this.maze.endFill;
      } else {
        ctx.fillStyle = this.maze.defaultFill;
      }
      ctx.beginPath();
      ctx.fillRect(this.column * cellWidth + 1, this.row * cellHeight + 1, cellWidth - 2, cellHeight - 2);
      ctx.closePath();

    };

// }

    return Maze;


  });
