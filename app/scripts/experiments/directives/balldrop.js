'use strict';

angular.module('mctApp')
  .directive('balldrop', function (BallDrop) {
    return {
      templateUrl: 'templates/balldrop.html',
      restrict: 'E',
      replace: true,
      link: function postLink(scope, element, attrs) {
        scope.canvas = element[0];
        scope.balldrop = new BallDrop(scope.canvas);
        scope.handleMouseDown = function (e) {
          var x = e.offsetX;
          var y = e.offsetY;

          scope.line = scope.balldrop.startNewLine(x, y);
        };

        scope.handleMouseMove = function (e) {
          if (!scope.line) { return; }
          var x = e.offsetX;
          var y = e.offsetY;
          scope.line.end = $V([x, y]);
          scope.balldrop.render();
          
          
        
        };
        scope.handleMouseUp = function (e) {
          //if (scope.line.start.e(1) === scope.line.end.e(1) && scope.line.start.e(2) === scope.line.end.e(2)) {
            //scope.balldrop.removeLine(scope.line)
          //}
          scope.line = null;
        
        };
      }
    };
  });
