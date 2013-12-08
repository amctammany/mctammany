'use strict';

describe('Controller: CollisionsCtrl', function () {

  // load the controller's module
  beforeEach(module('mctApp'));

  var CollisionsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CollisionsCtrl = $controller('CollisionsCtrl', {
      $scope: scope
    });
  }));

});
