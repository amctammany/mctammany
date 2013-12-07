'use strict';

describe('Controller: DrumkitCtrl', function () {

  // load the controller's module
  beforeEach(module('mctApp'));

  var DrumkitCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DrumkitCtrl = $controller('DrumkitCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
