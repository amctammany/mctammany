'use strict';

describe('Controller: MoleculesCtrl', function () {

  // load the controller's module
  beforeEach(module('mctApp'));

  var MoleculesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MoleculesCtrl = $controller('MoleculesCtrl', {
      $scope: scope
    });
  }));

});
