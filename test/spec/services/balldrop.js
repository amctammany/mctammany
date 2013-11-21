'use strict';

describe('Service: BallDrop', function () {

  // load the service's module
  beforeEach(module('mctApp'));

  // instantiate service
  var BallDrop;
  beforeEach(inject(function (_BallDrop_) {
    BallDrop = _BallDrop_;
  }));

  it('should do something', function () {
    expect(!!BallDrop).toBe(true);
  });

});
