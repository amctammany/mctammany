'use strict';

angular.module('mctApp')
  .controller('ShowMoleculeCtrl', function ($scope, $routeParams, Molecule, MoleculeStore, Renderer) {
    $scope.moleculeName = $routeParams.name;
    if ($routeParams.name) {
      $scope.moleculeStore = MoleculeStore.get({name: $routeParams.name}, function (data) {
        $scope.molecule = new Molecule(data.name, data.molFile, $scope.ctx);
        $scope.name = $scope.molecule.name;
        $scope.molecule.parseMolFile();
        $scope.renderer = new Renderer($scope.molecule, 'moleculeCanvas');
        $scope.renderer.render();
      });
    } else {
      $scope.molecule = new Molecule(false, false, $scope.ctx);
    }




  });
