'use strict';

describe('Controller: MarblesCtrl', function () {

  // load the controller's module
  beforeEach(module('mctApp'));

  var MarblesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MarblesCtrl = $controller('MarblesCtrl', {
      $scope: scope
    });
  }));

});
