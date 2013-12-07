'use strict';

angular.module('mctApp')
  .factory('Particle', function (Vector3) {
    var Particle = function (x, y, z, mass) {
      this.current = new Vector3(x, y, z);
      this.previous = new Vector3(x, y, z);
      this.velocity = new Vector3(0, 0, 0);
      this.acceleration = new Vector3(0, 0, 0);
      this.damping = 1;

      this.forceAccumulator = new Vector3(0, 0, 0);
      this.mass = (mass === undefined) ? 1 : mass;
      this.inverseMass = (this.mass === 0) ? 0 : 1 / this.mass;
    
    };

    Particle.prototype.integrate = function (delta) {
      if (this.inverseMass === 0) {return;}
      // Work out acceleration
      this.acceleration.iadd(this.forceAccumulator.mul(this.inverseMass * (delta * delta)));

      // Update velocity from acceleration
      //this.velocity.iadd(this.acceleration.mul(delta));

      // Update Position
      // Damping = 0.01
      var position = this.current.mul(1.99).sub(this.previous.mul(0.99)).add(this.acceleration);
      this.previous = this.current;
      this.current = position;
      //this.position.iadd(this.velocity.mul(delta));

      // Impose drag
      //this.velocity.imul(Math.pow(this.damping, delta));

      this.clearAccumulator();

    };

    Particle.prototype.getCurrent = function () {
      return this.current;
    };
    Particle.prototype.moveTo = function (x, y, z) {
      var pos = new Vector3(x, y, z);
      this.previous = this.current;
      this.current = pos;
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
