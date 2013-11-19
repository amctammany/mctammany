'use strict';

describe('Controller: EditMoleculeCtrl', function () {

  // load the controller's module
  beforeEach(module('mctApp'));

  var EditMoleculeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditMoleculeCtrl = $controller('EditMoleculeCtrl', {
      $scope: scope
    });
  }));

});
