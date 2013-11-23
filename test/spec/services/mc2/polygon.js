'use strict';

describe('Service: Polygon', function () {

  // load the service's module
  beforeEach(module('mctApp'));

  // instantiate service
  var Polygon;
  beforeEach(inject(function (_Polygon_) {
    Polygon = _Polygon_;
  }));

  it('should do something', function () {
    expect(!!Polygon).toBe(true);
  });

});
