'use strict';

describe('Service: Drumkit', function () {

  // load the service's module
  beforeEach(module('mctApp'));

  // instantiate service
  var Drumkit;
  beforeEach(inject(function (_Drumkit_) {
    Drumkit = _Drumkit_;
  }));

  it('should do something', function () {
    expect(!!Drumkit).toBe(true);
  });

});
