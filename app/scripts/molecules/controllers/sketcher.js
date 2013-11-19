'use strict';

angular.module('mctApp')
  .controller('MoleculeSketcherCtrl', function ($scope, $filter, $location, $routeParams, Molecule, MoleculeStore) {
    $scope.canvas = document.getElementById('chem-sketcher');
    $scope.div = angular.element(document.getElementById('chem-sketcher'));
    $scope.ctx = $scope.canvas.getContext('2d');
    if ($routeParams.name) {
      $scope.moleculeStore = MoleculeStore.get({name: $routeParams.name}, function (data) {
        $scope.molecule = new Molecule(data.name, data.molFile, $scope.ctx);
        $scope.name = $scope.molecule.name;
        $scope.molecule.parseMolFile();
        $scope.molecule.draw();
      });
    } else {
      $scope.molecule = new Molecule(false, false, $scope.ctx);
    }
    $scope.dragging = false;
    $scope.atomTool = 'C';
    $scope.bondTool = '1';
    $scope.mouseTool = false;
    $scope.mouseTools = ['select', 'group', 'delete'];
    $scope.bondTypes = ['1', '2', '3', 'd', 's'];
    $scope.atoms = ['C', 'H', 'N', 'O', 'P', 'S', 'B', 'Si', 'F', 'Cl', 'Br', 'I'];
    $scope.atomGroups = $filter('groupBy')($scope.atoms, 6);
     /*function (e) {*/
      //var x = e.offsetX;
      //var y = e.offsetY;
      //var closest = $scope.molecule.findNearestAtom(x, y, 0);
      //var obj = $scope.molecule.findNearestObject(x, y, 0);
      //console.log(obj);
      //if (closest.distance < 15) {
        //if ($scope.molecule.selectedAtom) {
          //if ($scope.molecule.selectedAtom.distanceFrom(closest.atom.x, closest.atom.y, closest.atom.z) < 150) {
            //$scope.molecule.addBond($scope.molecule.selectedAtom, closest.atom, parseInt($scope.bondTool, 10));
            //console.log('newBond');
          //}
        //}
        //$scope.molecule.selectedAtom = closest.atom;
        //$scope.molecule.draw();
      //} else {
        //$scope.molecule.addAtom($scope.atomTool, x, y, 0);
      //}
    /*});*/
    $scope.handleMouseDown = function (e) {
      var x = e.offsetX;
      var y = e.offsetY;
      var molecule = $scope.molecule;
      if ($scope.mouseTool && $scope.mouseTool === 'select') {
        var closestObj = molecule.findNearestObject(x, y, 0);
        molecule.changeSelection([closestObj.obj]);
        $scope.dragging = true;
        $scope.dragStart = {x: x, y: y};
        molecule.draw();
      }
    };
    $scope.handleMouseMove = function (e) {
      var x = e.offsetX;
      var y = e.offsetY;
      var molecule = $scope.molecule;
      if ($scope.dragging) {
        var dx = x - $scope.dragStart.x;
        var dy = y - $scope.dragStart.y;
        molecule.selection.map(function (obj) {
          obj.shift(dx, dy, 0);
          $scope.dragStart.x = x;
          $scope.dragStart.y = y;
        });
        molecule.draw();
      }
    };
    $scope.handleMouseUp = function (e) {
      var x = e.offsetX;
      var y = e.offsetY;
      var molecule = $scope.molecule;

      if ($scope.dragging) {
        $scope.dragging = false;

      }
      var closestObj = molecule.findNearestObject(x, y, 0);
      if ($scope.mouseTool) {
        if ($scope.molecule.selection.indexOf(closestObj.obj) >= 0) {
          closestObj.obj.change();
        }
        molecule.changeSelection([closestObj.obj]);
      } else if ($scope.atomTool && $scope.bondTool) {
        var atom;
        if (closestObj.score < 15) {
          atom = closestObj.obj;
        } else {
          atom = molecule.addAtom($scope.atomTool, x, y, 0);
        }
        if (molecule.selectedAtom && molecule.selectedAtom.distanceFrom(x, y, 0) < 75) {
          molecule.selectedAtom.bondTo(atom);
        }
        molecule.changeSelection([atom]);
      }
      molecule.draw();
    };
    $scope.div.on('mousedown', $scope.handleMouseDown);
    $scope.div.on('mousemove', $scope.handleMouseMove);
    $scope.div.on('mouseup', $scope.handleMouseUp);
    $scope.satisfy = function () {
      $scope.molecule.satisfy(0.1);
    };
    $scope.changeAtomTool = function (atom) {
      $scope.atomTool = atom;
      $scope.bondTool = $scope.bondTool ? $scope.bondTool : '1';
      $scope.mouseTool = false;
    };
    $scope.getAtomToolClass = function (atom) {
      var status = $scope.atomTool === atom ? 'active' : '';
      return status;
    };
    $scope.changeMouseTool = function (mouse) {
      $scope.mouseTool = mouse;
      $scope.atomTool = false;
      $scope.bondTool = false;
    };

    $scope.getMouseToolClass = function (mouse) {
      var status = $scope.mouseTool === mouse ? 'active' : '';
      return status;
    };
    $scope.changeBondTool = function (bond) {
      $scope.bondTool = bond;
      $scope.mouseTool = false;
      $scope.atomTool = $scope.atomTool ? $scope.atomTool : 'C';
    };
    $scope.getBondToolClass = function (bond) {
      var status = $scope.bondTool === bond ? 'active' : '';
      return status;
    };
    $scope.generateMolFile = function () {
      var mol = $scope.molecule.generateMolFile();
      console.log(mol);
    };
    $scope.saveMolecule = function () {
      var molFile = $scope.molecule.generateMolFile();
      if ($scope.moleculeStore) {
        $scope.moleculeStore.molFile = molFile;
        $scope.moleculeStore.$save();
      } else {
        var molecule = new MoleculeStore({name: $scope.name, molFile: molFile});
        molecule.$save();
      }
      $location.path('/chemistry/molecules');
    };

  });
