'use strict';

angular.module('mctApp')
  .factory('Atom', function () {
    // Atom {
    var Atom;
    Atom = function (element, x, y, z, molecule) {
      this.element = element;
      this.x = x;
      this.y = y;
      this.z = z;
      this.molecule = molecule;
      this.molecule.atoms.push(this);
      this.index = this.molecule.atoms.indexOf(this);
      this.bonds = [];
    
    };

    Atom.prototype.select = function () {
      if (this.molecule.selectedAtom) {
        this.molecule.selectedAtom.deselect();
      }
      this.molecule.selectedAtom = this;
      
    };
    Atom.prototype.deselect = function () {
      this.molecule.selectedAtom = false;
    };
    Atom.prototype.distanceFrom = function (x, y, z) {
      var dx = this.x - x;
      var dy = this.y - y;
      var dz = this.z - z;
      var distance = Math.sqrt((dx * dx) + (dy * dy) + (dz * dz));
      return distance;
    };

    Atom.prototype.change = function () {
      // To Be Implemented
      // Will allow UI change of atom's element

    };

    Atom.prototype.draw = function (ctx) {
      ctx.fillStyle = 'white';
      ctx.fillRect(this.x - 5, this.y - 5, 15, 12);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = this.molecule.selectedAtom === this ? 'red' : 'black';
      ctx.fillText(this.element, this.x - 2, this.y + 5);
      ctx.closePath();
      ctx.fill();
    };

    Atom.prototype.bondTo = function (atom) {
      var bond = this.molecule.addBond(this, atom, 1);
      return bond;
    };

    Atom.prototype.shift = function (dx, dy, dz) {
      this.x = this.x + dx;
      this.y = this.y + dy;
      this.z = this.z + dz;
    };

    // }

    return Atom;
  });
