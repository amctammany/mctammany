'use strict';

describe('Service: Boundary', function () {

  // load the service's module
  beforeEach(module('mctApp'));

  // instantiate service
  var Boundary, boundary, bounds;
  beforeEach(inject(function (_Boundary_) {
    Boundary = _Boundary_;
    bounds = {
      x: 0,
      y: 0,
      width: 100,
      height: 100
    };
    boundary = new Boundary(bounds);
  }));

  it('should do something', function () {
    expect(!!Boundary).toBe(true);
  });

  it('should validate particle is in bounds', function () {
    var pos = {x: 10, y: 20};
    expect(boundary.checkPosition(pos)).toBe(true);
  });

  it('should validate particle is out of bounds', function () {
    var pos = {x: 10, y: -20};
    expect(boundary.checkPosition(pos)).toBe(false);
  });
  it('should get correction for out of bounds position', function () {
    var pos, correction;
    pos = {x: -10, y: 50};
    correction = boundary.getCorrection(pos);
    expect(correction.x).toBe(10);
    expect(correction.y).toBe(0);

    pos = {x: 110, y: 50};
    correction = boundary.getCorrection(pos);
    expect(correction.x).toBe(-10);
    expect(correction.y).toBe(0);

    pos = {x: 10, y: -10};
    correction = boundary.getCorrection(pos);
    expect(correction.x).toBe(0);
    expect(correction.y).toBe(10);

    pos = {x: 10, y: 110};
    correction = boundary.getCorrection(pos);
    expect(correction.x).toBe(0);
    expect(correction.y).toBe(-10);
  });
});
