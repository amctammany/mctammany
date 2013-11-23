'use strict';

describe('Service: Mc2', function () {

  // load the service's module
  beforeEach(module('mctApp'));

  // instantiate service
  var Mc2;
  beforeEach(inject(function (_Mc2_) {
    Mc2 = _Mc2_;
  }));

  it('should do something', function () {
    expect(!!Mc2).toBe(true);
  });

});
