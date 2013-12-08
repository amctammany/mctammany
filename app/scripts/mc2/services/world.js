'use strict';

angular.module('mctApp')
  .factory('World', function (Particle, Spring, Gravity, Boundary) {
    var World = function () {
      this.particles = [];
      this.forceRegistry = [];
      this.gravity = null;
      this.damping = 0.01;
    
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

    World.prototype.addBoundaries = function (bounds) {
      this.boundary = new Boundary(bounds);
    };

    World.prototype.detectCollisions = function (particle) {
      var i, other, diff, normal, length, sqLength;
      var target = 20;
      for (i = 0; i < this.particles.length; ++i) {
        other = this.particles[i];
        if (particle !== other) {
          diff = particle.getCurrent().sub(other.getCurrent());
          length = diff.getMagnitude();
          sqLength = length * length;
        
          if (length < target) {
            var factor = (length - target) / length;
            particle.addForce(diff.mul(factor * -0.5));
            other.addForce(diff.mul(factor * 0.5));
          }
        }
      }
    };
    World.prototype.simulate = function (delta) {
      var gravity = this.gravity;
      var damping = this.damping;
      var boundary = this.boundary;
      var detectCollisions = this.detectCollisions.bind(this);
      this.forceRegistry.forEach(function (fg) {
        fg.update(delta);
      });
      this.particles.forEach(function (p) {
        if (p.isSelected) {return;}
        if (gravity) {p.addForce(gravity.acceleration);}
        if (boundary) {boundary.checkParticle(p);}
        detectCollisions(p);
        p.integrate(delta, damping);
      });
    };
    return World;
  });
