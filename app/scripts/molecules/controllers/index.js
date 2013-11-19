'use strict';

angular.module('mctApp')
  .controller('MoleculesCtrl', function ($scope, MoleculeStore) {
    $scope.molecules = MoleculeStore.query();
  });
