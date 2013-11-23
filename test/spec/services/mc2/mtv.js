'use strict';

describe('Service: MTV', function () {

  // load the service's module
  beforeEach(module('mctApp'));

  // instantiate service
  var MTV;
  beforeEach(inject(function (_MTV_) {
    MTV = _MTV_;
  }));

  it('should do something', function () {
    expect(!!MTV).toBe(true);
  });

});
