'use strict';

describe('Service: World', function () {

  // load the service's module
  beforeEach(module('mctApp'));

  // instantiate service
  var World, world;
  beforeEach(inject(function (_World_) {
    World = _World_;
    world = new World();
  }));

  it('should do something', function () {
    expect(!!World).toBe(true);
  });

  it('should add particle', function () {
    var oldLength = world.particles.length;
    world.addParticle();
    expect(world.particles.length).toBe(oldLength + 1);
  });

  it('should add force to registry', function () {
    var oldLength = world.forceRegistry.length;
    world.registerForceGenerator();
    expect(world.forceRegistry.length).toBe(oldLength + 1);
  });
});
