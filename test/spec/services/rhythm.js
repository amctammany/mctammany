'use strict';

describe('Service: Rhythm', function () {

  // load the service's module
  beforeEach(module('mctApp'));

  // instantiate service
  var Rhythm;
  beforeEach(inject(function (_Rhythm_) {
    Rhythm = _Rhythm_;
  }));

  it('should do something', function () {
    expect(!!Rhythm).toBe(true);
  });

});
