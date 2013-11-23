'use strict';

describe('Service: Vector', function () {

  // load the service's module
  beforeEach(module('mctApp'));

  // instantiate service
  var Vector;
  beforeEach(inject(function (_Vector_) {
    Vector = _Vector_;
  }));

  it('should do something', function () {
    expect(!!Vector).toBe(true);
  });

});
