'use strict';

describe('Controller: MazeCtrl', function () {

  // load the controller's module
  beforeEach(module('mctApp'));

  var MazeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MazeCtrl = $controller('MazeCtrl', {
      $scope: scope
    });
  }));

  it('should find lowest delta', function () {
    var deltas = {top: 1, bottom: 2, left: 3, right: 4};
    var lowest = scope.findLowestDelta(deltas);
    expect(lowest).toBe('top');

    deltas = {top: 9, bottom: 7, left: 2, right: 4};
    lowest = scope.findLowestDelta(deltas);
    expect(lowest).toBe('left');
  });

});
