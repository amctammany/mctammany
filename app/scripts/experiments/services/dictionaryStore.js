'use strict';

angular.module('mctApp')
  .factory('DictionaryStore', function ($resource) {
    return $resource('dictionaries/:name', {name: '@urlString'});
  });
