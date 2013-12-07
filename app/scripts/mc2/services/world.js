'use strict';

angular.module('mctApp')
  .factory('World', function (Particle, Spring, Gravity) {
    var World = function () {
      this.particles = [];
      this.forceRegistry = [];
      this.gravity = null;
    
    };

    World.prototype.addParticle = function (x, y, z, mass) {
      var particle = new Particle(x, y, z, mass);
      this.particles.push(particle);
      return particle;
    };

    World.prototype.addGravity = function (x, y, z) {
      this.gravity = new Gravity(x, y, z);
    };
    World.prototype.addSpringForceGenerator = function (p1, p2, k, rest) {
      var spring = new Spring(p1, p2, k, rest);
      this.registerForceGenerator(spring);
      return spring;
    };

    World.prototype.registerForceGenerator = function (fg) {
      this.forceRegistry.push(fg);
      return fg;
    };

    World.prototype.simulate = function (delta) {
      var gravity = this.gravity;
      this.forceRegistry.forEach(function (fg) {
        fg.update(delta);
      });
      this.particles.forEach(function (p) {
        if (p.isSelected) {return;}
        if (gravity) {p.addForce(gravity.acceleration);}
        p.integrate(delta);
      });
    };
    return World;
  });
