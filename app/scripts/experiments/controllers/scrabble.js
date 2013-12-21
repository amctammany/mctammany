'use strict';

angular.module('mctApp')
  .controller('ScrabbleCtrl', function ($scope, fileReader, DictionaryStore, Dictionary) {
    var dictionary;
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
    $scope.loadFromDictionary = function () {
      $scope.wordList = $scope.words.join('\n');
    };
    $scope.loadDictionary = function () {
      console.log($scope.selectedDictionary);
      $scope.words = $scope.selectedDictionary.words;
    
    };
    $scope.saveDictionary = function () {
      console.log('save dict');
      $scope.dict = new DictionaryStore({name: $scope.dictName, words: $scope.words});
      $scope.dict.$save();
    };

    $scope.encodeDictionary = function () {
      var words = $scope.wordList.split(/\s+/);
      $scope.dictionary = new Dictionary(words);
      dictionary = new Dictionary(words);
      console.log($scope.dictionary);
    };

    $scope.init = function () {
      DictionaryStore.get({name: 'scrabble'}, function (dict) {
        $scope.dict = dict;
        $scope.words = $scope.dict.words;

        //console.log($scope.dictionary.trie);
      });
    };

    $scope.searchDictionary = function () {
      //console.log(dictionary.lookUp($scope.search));
      var ftrie = new Dictionary.FrozenTrie(dictionary.trieData, dictionary.directoryData, dictionary.trie.getNodeCount());
      console.log(ftrie);
      console.log(ftrie.lookup($scope.search));
    };
  });
