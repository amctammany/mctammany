'use strict';

describe('Controller: NewMoleculeCtrl', function () {

  // load the controller's module
  beforeEach(module('mctApp'));

  var NewMoleculeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NewMoleculeCtrl = $controller('NewMoleculeCtrl', {
      $scope: scope
    });
  }));

});
