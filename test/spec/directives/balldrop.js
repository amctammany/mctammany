'use strict';

describe('Directive: BallDrop', function () {

  // load the directive's module
  beforeEach(module('mctApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<balldrop></balldrop>');
    element = $compile(element)(scope);
  }));
});
