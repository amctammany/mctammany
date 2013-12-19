'use strict';

angular.module('mctApp')
  .controller('ScrabbleCtrl', function ($scope, fileReader, DictionaryStore) {
    $scope.getFile = function () {
      $scope.progress = 0;
      fileReader.readAsText($scope.file, $scope)
        .then(function (result) {
          var words = result.split('\n');
          $scope.words = words;
        });
    };
    $scope.$on('fileProgress', function (e, progress) {
      $scope.progress = progress.loaded / progress.total;
    });

    $scope.dictionaries = DictionaryStore.query();
    $scope.loadDictionary = function () {
      console.log($scope.selectedDictionary);
      $scope.words = $scope.selectedDictionary.words;
    
    };
    $scope.saveDictionary = function () {
      console.log('save dict');
      $scope.dict = new DictionaryStore({name: $scope.dictName, words: $scope.words});
      $scope.dict.$save();
    };

    $scope.init = function () {
      DictionaryStore.get({name: 'scrabble'}, function (dict) {
        $scope.dict = dict;
        $scope.words = $scope.dict.words;
      });
    };
  });
