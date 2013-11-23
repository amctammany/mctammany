'use strict';

describe('Service: Point', function () {

  // load the service's module
  beforeEach(module('mctApp'));

  // instantiate service
  var Point;
  beforeEach(inject(function (_Point_) {
    Point = _Point_;
  }));

  it('should do something', function () {
    expect(!!Point).toBe(true);
  });

});
