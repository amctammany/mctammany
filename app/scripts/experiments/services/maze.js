'use strict';

angular.module('mctApp')
  .factory('Maze', function () {

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

    var Path = function (maze, start, history) {
      this.maze = maze;
      this.start = start;
      this.history = history ? history : [];
      this.previous = history ? history[history.length - 1] : this.start;
      this.branchPoints = [];
      this.cell = start;
      var choice = this.choosePath();
      this.travelTo(choice);
    };

    Path.prototype.choosePath = function () {
      var choices = [];
      var next;
      if (this.cell.left) {
        next = this.maze.findCell(this.cell.column - 1, this.cell.row);
        if (next !== this.previous && this.history.indexOf(next) < 0) {
          choices.push(next);
        }
      }
      if (this.cell.right) {
        next = this.maze.findCell(this.cell.column + 1, this.cell.row);
        if (next !== this.previous  && this.history.indexOf(next) < 0) {
          choices.push(next);
        }
      }
      if (this.cell.top) {
        next = this.maze.findCell(this.cell.column, this.cell.row - 1);
        if (next !== this.previous  && this.history.indexOf(next) < 0) {
          choices.push(next);
        }
      }
      if (this.cell.bottom) {
        next = this.maze.findCell(this.cell.column, this.cell.row + 1);
        if (next !== this.previous  && this.history.indexOf(next) < 0) {
          choices.push(next);
        }
      }
      if (choices.length > 1) {
        this.branchPoints.push(this.cell);
      }
      var choice = choices[Math.floor(Math.random() * choices.length)];
      return choice;
    };
    Path.prototype.travelTo = function (cell) {
      if (this.maze.stopped) {return;}
      if (cell === this.maze.end) {
        window.alert('Win');
        return;
      }
      if (!cell) {
        var lastBranch = this.branchPoints[this.branchPoints.length - 1];
        var index = this.history.indexOf(lastBranch);
        var history = this.history.splice(0, index);
        lastBranch.fill = 'green';
        this.maze.draw();
        new Path(this.maze, lastBranch, this.history);
        return;
      }
      this.history.push(this.cell);
      this.previous = this.cell;
      this.cell = cell;
      this.cell.fill = 'white';
      var self = this;
      this.maze.draw();
      window.setTimeout(function () {
        self.travelTo(self.choosePath());
      }, 100);
    
    };
    
// Maze {
    var Maze = function (canvas, columns, rows) {
      this.rows = rows;
      this.columns = columns;

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

    Maze.prototype.solve = function () {
      this.stopped = false;
      var path = new Path(this, this.start);
    };
    Maze.prototype.stop = function () {
      this.stopped = true;
    };
    Maze.prototype.getIndex = function (column, row) {
      return column + (row * this.rows);
    };
    Maze.prototype.findCell = function (column, row) {
      return this.cells[column + (row * this.rows)];
    };

    Maze.prototype.generateConfig = function () {
      if (!this.end || !this.start) {
        console.log('incomplete maze');
        return;
      }
      var cellData = this.cells.map(function (cell) {
        return {
          row: cell.row,
          column: cell.column,
          left: cell.left,
          right: cell.right,
          top: cell.top,
          bottom: cell.bottom
        };
      });

      var data = {
        rows: this.rows,
        columns: this.columns,
        start: {column: this.start.column, row: this.start.row},
        end: {column: this.end.column, row: this.end.row},
        cells: cellData
      };
      //var config = JSON.stringify(data);
      return JSON.stringify(data);
    };

    Maze.prototype.load = function (config) {
      this.loadData = config;
      console.log(config);
      this.columns = config.columns;
      this.rows = config.rows;
      this.cells = new Array(this.rows * this.columns);

      this.cellWidth = this.canvas.width / this.columns;
      this.cellHeight = this.canvas.height / this.rows;
      var self = this;
      var cellCopy;
      config.cells.forEach(function (cell) {
        cellCopy = self.addCell(cell.column, cell.row);
        cellCopy.maze = self;
        cellCopy.top = cell.top;
        cellCopy.bottom = cell.bottom;
        cellCopy.left = cell.left;
        cellCopy.right = cell.right;
        self.cells[self.getIndex(cell.column, cell.row)] = cellCopy;
      });
      this.start = this.findCell(config.start.column, config.start.row);
      this.end = this.findCell(config.end.column, config.end.row);
      this.draw();
    
    };
    Maze.prototype.reset = function () {
      if (this.loadData) {
        this.load(this.loadData);
        return;
      }
      var row, column, cell;
      this.cellWidth = this.canvas.width / this.columns;
      this.cellHeight = this.canvas.height / this.rows;


      this.cells = new Array(this.rows * this.columns);
      for (row = 0; row < this.rows; ++row) {
        for (column = 0; column < this.columns; ++column) {
          cell = this.addCell(column, row);
          this.cells[this.getIndex(column, row)] = cell;
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
      if (!this.canvas) {return;}
      var ctx = this.ctx;
      ctx.clearRect(0, 0, this.width, this.height);
      this.cells.forEach(function (cell) {
        cell.draw(ctx);
      });
    };

// }

// Cell {
    var Cell = function (column, row) {
      this.column = column;
      this.row = row;
      this.fill = 'lightsteelblue';
      this.left = false;
      this.right = false;
      this.top = false;
      this.bottom = false;

    };

  // Remove Wall {
    Cell.prototype.removeWall = function (side) {
      var neighbor;
      var maze = this.maze;
      if (side === 'left') {
        if (this.column - 1 < 0) { return; }
        neighbor = maze.findCell(this.column - 1, this.row);
        if (neighbor) {
          this.left = this.left ? false : true;
          neighbor.right = neighbor.right ? false : true;
        }
      }
      if (side === 'right') {
        if (this.column + 1 >= maze.columns) { return; }
        neighbor = maze.findCell(this.column + 1, this.row);
        console.log(neighbor);
        if (neighbor) {
          this.right = this.right ? false : true;
          neighbor.left = neighbor.left ? false : true;
        }
      }

      if (side === 'top') {
        if (this.row - 1 < 0) {return;}
        neighbor = maze.findCell(this.column, this.row - 1);
        if (neighbor) {
          this.top = this.top ? false : true;
          neighbor.bottom = neighbor.bottom ? false : true;
        }
      }

      if (side === 'bottom') {
        if (this.row + 1 >= maze.rows) {return;}
        neighbor = maze.findCell(this.column, this.row + 1);
        console.log(neighbor);
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
      if (this.maze.start === this) {
        ctx.fillStyle = this.maze.startFill;
      } else if (this.maze.end === this) {
        ctx.fillStyle = this.maze.endFill;
      } else {
        ctx.fillStyle = this.fill;
      }
      ctx.beginPath();
      ctx.fillRect(this.column * cellWidth, this.row * cellHeight, cellWidth, cellHeight);
      ctx.closePath();

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

    };

    // }
// }

    return Maze;


  });
