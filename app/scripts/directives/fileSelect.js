'use strict';

angular.module('mctApp')
  .directive('fileSelect', function () {
    return {
      link: function postLink(scope, element, attrs) {
        element.bind('change', function (e) {
          scope.file = (e.srcElement || e.target).files[0];
          scope.getFile();
        });
      }
    };
  });
