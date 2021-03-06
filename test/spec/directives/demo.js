'use strict';

describe('Directive: demo', function () {

  // load the directive's module
  beforeEach(module('mctApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<demo></demo>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the demo directive');
  }));
});
