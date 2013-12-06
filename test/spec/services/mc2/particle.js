'use strict';

describe('Service: Particle', function () {

  // load the service's module
  beforeEach(module('mctApp'));

  // instantiate service
  var Particle, x, y, z, particle;
  beforeEach(inject(function (_Particle_) {
    Particle = _Particle_;
    x = 5;
    y = 10;
    z = 15;
    particle = new Particle(x, y, z);

  }));

  it('should do something', function () {
    expect(!!Particle).toBe(true);
  });

  it('should instantiate particle with current', function () {
    expect(particle.current.x).toBe(x);
    expect(particle.current.y).toBe(y);
    expect(particle.current.z).toBe(z);
  });

  it('should instantiate particle with mass', function () {
    var p = new Particle(x, y, z, 1);
    expect(p.mass).toBe(1);
    expect(p.inverseMass).toBe(1);
  });
  it('should instantiate particle with no mass', function () {
    var p = new Particle(x, y, z, 0);
    expect(p.mass).toBe(0);
    expect(p.inverseMass).toBe(0);
  });

  it('should integrate particle with delta = 1', function () {
    expect(particle.current.x).toBe(x);
    expect(particle.current.y).toBe(y);
    expect(particle.current.z).toBe(z);
    particle.acceleration.x = x;
    particle.acceleration.y = y;
    particle.acceleration.z = z;
    particle.integrate(1);
    expect(particle.current.x).toBe(x + x);
    expect(particle.current.y).toBe(y + y);
    expect(particle.current.z).toBe(z + z);

  });

});
