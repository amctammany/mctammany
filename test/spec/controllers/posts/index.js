'use strict';

describe('Controller: PostsCtrl', function () {

  // load the controller's module
  beforeEach(module('mctApp'));

  var PostsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PostsCtrl = $controller('PostsCtrl', {
      $scope: scope
    });
  }));

});
