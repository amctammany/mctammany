'use strict';

describe('Controller: NewPostCtrl', function () {

  // load the controller's module
  beforeEach(module('mctApp'));

  var NewPostCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NewPostCtrl = $controller('NewPostCtrl', {
      $scope: scope
    });
  }));

});
