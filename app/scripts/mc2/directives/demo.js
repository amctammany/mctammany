'use strict';

angular.module('mctApp')
  .directive('demo', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the demo directive');
      }
    };
  });
