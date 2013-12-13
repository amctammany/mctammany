'use strict';

angular.module('mctApp')
  .controller('MazeCtrl', function ($scope, Maze) {
    $scope.rows = 10;
    $scope.columns = 10;

    $scope.mazes = ['hi', 'you7', 'foo'];


    var cellWidth, cellHeight;

    var defaultFill = 'lightsteelblue';
    var startFill = 'lightgreen';
    var endFill = 'red';
    $scope.init = function () {
    
      var canvas = angular.element(document.getElementById('maze-canvas'))[0];

      canvas.width = 700;
      canvas.height = 700;

      $scope.maze = new Maze(canvas, $scope.columns, $scope.rows);
      cellWidth = $scope.maze.cellWidth;
      cellHeight = $scope.maze.cellHeight;
    };





    $scope.handleMouseDown = function (e) {
      var column = Math.floor(e.offsetX / cellWidth);
      var row = Math.floor(e.offsetY / cellHeight);
      var cell = $scope.maze.findCell(column, row);
      if ($scope.maze.startSelection) {
        $scope.maze.startSelection = false;
        return;
      }
      if ($scope.maze.endSelection) {
        $scope.maze.endSelection = false;
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
      $scope.maze.draw();
    };
    $scope.handleMouseMove = function (e) {
      var column = Math.floor(e.offsetX / cellWidth);
      var row = Math.floor(e.offsetY / cellHeight);
      var cell = $scope.maze.findCell(column, row);

      if ($scope.maze.startSelection) {
        $scope.maze.start = cell;
      }
      if ($scope.maze.endSelection) {
        $scope.maze.end = cell;
      }

      $scope.maze.draw();
    
    };

    var draw = function draw () {
      $scope.ctx.clearRect(0, 0, $scope.canvas.width, $scope.canvas.height);
      $scope.cells.forEach(function (cell) {
        cell.draw($scope.ctx);
      });
    };

    $scope.addStart = function () {
      $scope.maze.startSelection = true;
    };

    $scope.addEnd = function () {
      $scope.maze.endSelection = true;
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
