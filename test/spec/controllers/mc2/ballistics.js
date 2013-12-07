'use strict';

describe('Controller: BallisticsCtrl', function () {

  // load the controller's module
  beforeEach(module('mctApp'));

  var BallisticsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BallisticsCtrl = $controller('BallisticsCtrl', {
      $scope: scope
    });
  }));

});
