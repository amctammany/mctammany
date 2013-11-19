'use strict';

describe('Controller: ShowMoleculeCtrl', function () {

  // load the controller's module
  beforeEach(module('mctApp'));

  var ShowMoleculeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ShowMoleculeCtrl = $controller('ShowMoleculeCtrl', {
      $scope: scope
    });
  }));

});
