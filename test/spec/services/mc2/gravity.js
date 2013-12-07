'use strict';

describe('Service: Gravity', function () {

  // load the service's module
  beforeEach(module('mctApp'));

  // instantiate service
  var Gravity;
  beforeEach(inject(function (_Gravity_) {
    Gravity = _Gravity_;
  }));

  it('should do something', function () {
    expect(!!Gravity).toBe(true);
  });

});
