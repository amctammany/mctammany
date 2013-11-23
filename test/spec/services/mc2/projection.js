'use strict';

describe('Service: Projection', function () {

  // load the service's module
  beforeEach(module('mctApp'));

  // instantiate service
  var Projection;
  beforeEach(inject(function (_Projection_) {
    Projection = _Projection_;
  }));

  it('should do something', function () {
    expect(!!Projection).toBe(true);
  });

});
