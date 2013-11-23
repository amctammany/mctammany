'use strict';

describe('Service: Circle', function () {

  // load the service's module
  beforeEach(module('mctApp'));

  // instantiate service
  var Circle;
  beforeEach(inject(function (_Circle_) {
    Circle = _Circle_;
  }));

  it('should do something', function () {
    expect(!!Circle).toBe(true);
  });

});
