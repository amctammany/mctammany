'use strict';

angular.module('mctApp')
  .factory('Bond', function () {
    var Bond;
    // Bond {
    Bond = function (start, end, order, molecule) {
      this.startAtom = start;
      this.startAtom.bonds.push(this);
      this.endAtom = end;
      this.endAtom.bonds.push(this);
      this.order = order;
      this.restLength = 50;
      this.molecule = molecule;
      this.molecule.bonds.push(this);
      this.index = this.molecule.bonds.indexOf(this);
    };
    Bond.prototype.change = function () {
      this.order = (this.order++ % 3) + 1;
      console.log(this.order);
    };

    Bond.prototype.distanceFrom = function (x, y, z) {
      var midX = ((this.startAtom.x - this.endAtom.x) / 2) + this.endAtom.x;
      var midY = ((this.startAtom.y - this.endAtom.y) / 2) + this.endAtom.y;
      var midZ = ((this.startAtom.z - this.endAtom.z) / 2) + this.endAtom.z;
      var dx = midX - x;
      var dy = midY - y;
      var dz = midZ - z;
      var length = Math.sqrt((dx * dx) + (dy * dy) + (dz * dz));
      return length;
    };
    Bond.prototype.draw = function (ctx) {
      ctx.beginPath();
      ctx.strokeStyle = this.molecule.selectedBond === this ? 'red' : 'black';
      for (var i = 1; i <= this.order; i++) {
        ctx.moveTo(this.startAtom.x + (i * 2 - 1), this.startAtom.y + i * 2 - 1);
        ctx.lineTo(this.endAtom.x + i * 2 - 1, this.endAtom.y + i * 2 - 1);
      }
      //ctx.closePath();
      ctx.stroke();
    };

    Bond.prototype.select = function () {
      if (this.molecule.selectedBond) {
        this.molecule.selectedBond.deselect();
      }
      this.molecule.selectedBond = this;
      
    };
    Bond.prototype.deselect = function () {
      this.molecule.selectedBond = false;
    };
    Bond.prototype.shift = function () {
      return;
    };
    Bond.prototype.satisfy = function (delta) {
      console.log(delta);
    
    };

    return Bond;
  });
