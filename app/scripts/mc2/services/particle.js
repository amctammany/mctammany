'use strict';

angular.module('mctApp')
  .factory('Particle', function (Vector3) {
    var Particle = function (x, y, z, mass) {
      this.position = new Vector3(x, y, z);
      this.velocity = new Vector3(0, 0, 0);
      this.acceleration = new Vector3(0, 0, 0);
      this.damping = 1;

      this.forceAccumulator = new Vector3(0, 0, 0);
      this.mass = (mass === undefined) ? 1 : mass;
      this.inverseMass = (this.mass === 0) ? 0 : 1 / this.mass;
    
    };

    Particle.prototype.integrate = function (delta) {
      // Update Position
      this.position.iadd(this.velocity.mul(delta));

      // Work out acceleration
      this.acceleration.iadd(this.forceAccumulator.mul(this.inverseMass));

      // Update velocity from acceleration
      this.velocity.iadd(this.acceleration.mul(delta));

      // Impose drag
      //this.velocity.imul(Math.pow(this.damping, delta));

      this.clearAccumulator();

    };

    Particle.prototype.addForce = function (f) {
      this.forceAccumulator.iadd(f);
    };
    Particle.prototype.clearAccumulator = function () {
      this.acceleration.zero();
      this.forceAccumulator.zero();
    };

    return Particle;
  });
