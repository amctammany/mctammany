'use strict';

describe('Controller: BalldropCtrl', function () {

  // load the controller's module
  beforeEach(module('mctApp'));

  var BalldropCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BalldropCtrl = $controller('BalldropCtrl', {
      $scope: scope
    });
  }));
});
