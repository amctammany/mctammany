'use strict';

angular.module('mctApp')
  .directive('balldrop', function () {
    return {
      template: '<canvas></canvas>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the balldrop directive');
      }
    };
  });
