'use strict';

describe('Filter: tagFilter', function () {

  // load the filter's module
  beforeEach(module('mctApp'));

  // initialize a new instance of the filter before each test
  var tagFilter;
  beforeEach(inject(function ($filter) {
    tagFilter = $filter('tagFilter');
  }));


});
