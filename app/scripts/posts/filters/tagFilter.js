'use strict';

angular.module('mctApp')
  .filter('tagFilter', function () {
    return function (input, tags) {
      if (tags.length < 1) {return input;}
      if (!input.$resolved) {return;}
      var output = [];
      console.log(input.length);
      function addTagToArray (array) {
        return function (tag) {
          array.push(tag.name);
        };
      }
      for (var t = 0; t < tags.length; t++) {
        var tag = tags[t];
        for (var i = 0; i < input.length; i++) {
          var obj = input[i];
          var names = [];
          var addNameFn = addTagToArray(names);
          obj.tags.map(addNameFn);
          if (names.indexOf(tag) >= 0) {
            output.push(obj);
          }
        }
      }
      return output;
    };
  });
