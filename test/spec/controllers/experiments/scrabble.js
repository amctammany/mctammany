'use strict';

describe('Controller: ScrabbleCtrl', function () {

  // load the controller's module
  beforeEach(module('mctApp'));

  var ScrabbleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ScrabbleCtrl = $controller('ScrabbleCtrl', {
      $scope: scope
    });
  }));

});
