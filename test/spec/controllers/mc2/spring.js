'use strict';

describe('Controller: SpringCtrl', function () {

  // load the controller's module
  beforeEach(module('mctApp'));

  var SpringCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SpringCtrl = $controller('SpringCtrl', {
      $scope: scope
    });
  }));

});
