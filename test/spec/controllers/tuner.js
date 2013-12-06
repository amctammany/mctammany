'use strict';

describe('Controller: TunerCtrl', function () {

  // load the controller's module
  beforeEach(module('mctApp'));

  var TunerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TunerCtrl = $controller('TunerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
