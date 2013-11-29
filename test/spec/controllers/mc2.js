'use strict';

describe('Controller: Mc2Ctrl', function () {

  // load the controller's module
  beforeEach(module('mctApp'));

  var Mc2Ctrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    Mc2Ctrl = $controller('Mc2Ctrl', {
      $scope: scope
    });
  }));

});
