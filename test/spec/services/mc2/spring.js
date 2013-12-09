'use strict';

describe('Service: Spring', function () {

  // load the service's module
  beforeEach(module('mctApp'));

  // instantiate service
  var Spring, Particle, p1, p2, spring;
  beforeEach(inject(function (_Spring_, _Particle_) {
    Spring = _Spring_;
    Particle = _Particle_;
    p1 = new Particle('world', 10, 10, 0);
    p2 = new Particle('world', 30, 10, 0);
    spring = new Spring(p1, p2, 10, 1);
  }));

  it('should do something', function () {
    expect(!!Spring).toBe(true);
  });

  it('should get length', function () {
    expect(spring.getLength()).toBe(20);
  });

  it('should get direction', function () {
    var expectedDirection = {x: 1, y: 0, z: 0};
    var direction = spring.getDirection();
    expect(direction.x).toBe(expectedDirection.x);
    expect(direction.y).toBe(expectedDirection.y);
    expect(direction.z).toBe(expectedDirection.z);
  });

});
