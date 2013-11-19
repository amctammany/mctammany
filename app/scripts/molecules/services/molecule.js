'use strict';

angular.module('mctApp')
  .factory('Molecule', function (Atom, Bond) {
    // Molecule {
    var Molecule;
    Molecule = function (name, molFile, ctx) {
      this.name = name;
      this.molFile = molFile;
      this.ctx = ctx;
      this.atoms = [];
      this.bonds = [];
      this.selection = [];
      this.selectedAtom = null;
      this.selectedBond = null;
      this.dirty = false;
    };
    Molecule.prototype.clearSelection = function () {
      for (var i = 0; i < this.selection.length; i++) {
        var obj = this.selection[i];
        obj.deselect();
      }
      this.selection.splice(0, this.selection.length);
    };
    Molecule.prototype.changeSelection = function (objs) {
      this.clearSelection();
      for (var i = 0; i < objs.length; i++) {
        var obj = objs[i];
        obj.select();
        this.selection.push(obj);
      }
    };

    Molecule.prototype.draw = function () {
      if (!this.ctx) {return;}
      var self = this;
      this.ctx.clearRect(0, 0, 500, 500);
      this.bonds.map(function (bond) {
        bond.draw(self.ctx);
      });
      this.atoms.map(function (atom) {
        atom.draw(self.ctx);
      });
    };

    Molecule.prototype.findNearestObject = function (x, y, z) {
      var bestAtom = this.findNearestAtom(x, y, z);
      var bestBond = this.findNearestBond(x, y, z);
      var obj;
      if (bestAtom.distance < bestBond.distance * 1.5) {
        obj = {obj: bestAtom.atom, score: bestAtom.distance};
      } else {
        obj = {obj: bestBond.bond, score: bestBond.distance};
      }
      return obj;

    };
    Molecule.prototype.findNearestAtom = function (x, y, z) {
      var bestScore = 999,
          bestAtom;
      var length = this.atoms.length;
      for (var i = 0; i < length; i ++) {
        var atom = this.atoms[i];
        var distance = atom.distanceFrom(x, y, z);
        if (distance < bestScore) {
          bestScore = distance;
          bestAtom = atom;
        }
      }
      return {
        atom: bestAtom,
        distance: bestScore
      };
    
    };
    Molecule.prototype.findNearestBond = function (x, y, z) {
      var bestScore = 999,
          bestBond;
      var length = this.bonds.length;
      for (var i = 0; i < length; i ++) {
        var bond = this.bonds[i];
        var distance = bond.distanceFrom(x, y, z);
        if (distance < bestScore) {
          bestScore = distance;
          bestBond = bond;
        }
      }
      return {
        bond: bestBond,
        distance: bestScore
      };
    
    };

    Molecule.prototype.getBoundingBox = function () {
      var positions = this.atoms.map(function (atom) {
        return {x: atom.x, y: atom.y, z: atom.z, index: atom.index};
      });

      positions.sort(function (a,b){return a.x - b.x;});
      this.minX = positions[0].x;
      this.maxX = positions[positions.length - 1].x;
      positions.sort(function (a,b) {return a.y - b.y;});
      this.minY = positions[0].y;
      this.maxY = positions[positions.length - 1].y;
      positions.sort(function (a,b) {return a.z - b.z;});
      this.minZ = positions[0].z;
      this.maxZ = positions[positions.length - 1].z;

      this.width = this.maxX - this.minX;
      this.height = this.maxY - this.minY;
      this.depth = this.maxZ - this.minZ;
      this.depth = this.depth === Infinity ? 1 : this.depth;

      console.log(this.width);
      console.log(this.height);
      console.log(this.depth);

    };
    Molecule.prototype.normalize = function () {
      for (var i = 0; i < this.atoms.length; i++) {
        var atom = this.atoms[i];
        atom.x = atom.x - (this.minX + this.width) / 2;
        atom.x = atom.x / (1 * this.width / 2);
        atom.x = atom.x.toFixed(3);
        atom.y = atom.y - (this.minY + this.height) / 2;
        atom.y = atom.y / (1 * this.height / 2);
        atom.y = atom.y.toFixed(3);
        atom.z = atom.z - (this.minZ + this.depth) / 2;
        atom.z = atom.z / (1 * this.depth / 2);
        atom.z = atom.z ? atom.z : 1;
        atom.z = atom.z.toFixed(3);
        atom.z = 1;
      }

      console.log(this.atoms);
    };
 
    Molecule.prototype.satisfy = function (delta) {
      var i;
      for (i = 0; i < this.bonds.length; i++) {
        var bond = this.bonds[i];
        bond.satisfy(delta);
      }
    };
    Molecule.prototype.addAtom = function (element, x, y, z) {
      var atom = new Atom(element, x, y, z, this);
      //if (this.selectedAtom) {
        //if (this.selectedAtom.distanceFrom(x, y, z) < 75) {this.selectedAtom.bondTo(atom);}
      //}
      this.draw();
      this.dirty = true;
      return atom;
    };

    Molecule.prototype.addBond = function (start, end, order) {
      var bond = new Bond(start, end, order, this);
      this.draw();
      return bond;
    };

    Molecule.prototype.generateMolFile = function () {
      //this.getBoundingBox();
      //this.normalize();
      var numAtoms = this.atoms.length;
      var numBonds = this.bonds.length;
      var resultArray = [];
      resultArray.push(numAtoms + ' ' + numBonds);
      for (var i = 0; i < numAtoms; i++) {
        var atom = this.atoms[i];
        resultArray.push([atom.element, atom.x, atom.y, atom.z].join(' '));
      }
      for (var j = 0; j < numBonds; j++) {
        var bond = this.bonds[j];
        resultArray.push([bond.startAtom.index, bond.endAtom.index, bond.order].join(' '));
      }
      var result = resultArray.join('\n');
      this.molFile = result;
      return result;
    };

    Molecule.prototype.parseMolFile = function () {
      console.log(this.molFile);
      var lines = this.molFile.split('\n');
      var info = lines[0].split(' ');

      var numAtoms = parseInt(info[0], 10);
      var numBonds = parseInt(info[1], 10);
      var line, lineInfo, i;
      for (i = 0; i < numAtoms; i++) {
        line = lines[i + 1];
        lineInfo = line.split(' ');
        var element = lineInfo[0];
        var x = parseFloat(lineInfo[1]);
        var y = parseFloat(lineInfo[2]);
        var z = parseFloat(lineInfo[3]);
        new Atom(element, x, y, z, this);
        //console.log(atom);
        //atom.draw(this.ctx);
      }
      for (i = 0; i < numBonds; i++) {
        line = lines[i + numAtoms + 1];
        lineInfo = line.split(' ');
        var startIndex = parseInt(lineInfo[0], 10);
        var startAtom = this.atoms[startIndex];
        var endIndex = parseInt(lineInfo[1], 10);
        var endAtom = this.atoms[endIndex];
        var order = parseInt(lineInfo[2], 10);
        new Bond(startAtom, endAtom, order, this);
        //console.log(bond);
        //bond.draw(this.ctx);
      }
    };
    // }

    return Molecule;
  });
