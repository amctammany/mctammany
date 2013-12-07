'use strict';

angular.module('mctApp')
  .directive('toggle', function () {
    return {
      replace: true,
      template: '<button class="btn btn-success" ng-click="toggle()">{{text}}</button>',
      restrict: 'E',
      link: function postLink(scope, elm, attrs, ctrl) {
        scope.active = false;
        scope.text = attrs.off;
        scope.toggle = function () {
          scope[attrs.action]();
          if (scope.active) {
            elm.removeClass('btn-danger');
            elm.addClass('btn-success');
            scope.text = attrs.off;
            scope.active = false;
          } else {
            elm.removeClass('btn-success');
            elm.addClass('btn-danger');
            scope.text = attrs.on;
            scope.active = true;
          }
        };
      }
    };
  });
