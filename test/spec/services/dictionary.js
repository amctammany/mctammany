'use strict';

describe('Service: Dictionary', function () {

  // load the service's module
  beforeEach(module('mctApp'));

  // instantiate service
  var Dictionary;
  beforeEach(inject(function (_Dictionary_) {
    Dictionary = _Dictionary_;
  }));

  it('should do something', function () {
    expect(!!Dictionary).toBe(true);
  });

});
