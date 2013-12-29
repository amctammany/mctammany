'use strict';

angular.module('mctApp')
  .controller('ThreeCtrl', function ($scope, MoleculeStore, Molecule) {
    $scope.molecules = MoleculeStore.query();

    $scope.loadMolecule = function (molecule) {
      var mol = new Molecule(molecule.name, molecule.molFile, 'ctx');
      mol.parseMolFile();
      mol.normalize();
      $scope.molecule = mol;
    };

    $scope.activeMolecule = function (molecule) {
      if ($scope.molecule === molecule) {
        return 'active';
      } else {
        return '';
      }
    };

  });
