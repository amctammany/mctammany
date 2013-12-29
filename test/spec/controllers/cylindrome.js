'use strict';

describe('Controller: CylindromeCtrl', function () {

  // load the controller's module
  beforeEach(module('mctApp'));

  var CylindromeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CylindromeCtrl = $controller('CylindromeCtrl', {
      $scope: scope
    });
  }));

});
