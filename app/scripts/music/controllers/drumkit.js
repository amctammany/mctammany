'use strict';

angular.module('mctApp')
  .controller('DrumkitCtrl', function ($scope, $filter, Drumkit) {
    var active = false;
    $scope.drumkit = new Drumkit();
    $scope.tempo = 120;
    $scope.kit = 'kit1';
    $scope.beats = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
    $scope.instruments = $scope.drumkit.rhythm.channels;

    $scope.measures = $filter('groupBy')($scope.beats, 4);
    $scope.loadRhythm = function(index) {
      $scope.drumkit.rhythm.load($scope.drumkit.rhythm.demos[index]);
    };
    $scope.loadKit = function () {
      var kit = $scope.kit;
      $scope.instruments.forEach(function (instrument) {
        $scope.drumkit.loadSound('/sounds/' + kit + '/' + instrument + '.wav', instrument);
      });
    };
    $scope.play = function () {
      active = !active;
      if (active) {
        $scope.drumkit.handlePlay();
      } else {
        $scope.drumkit.handleStop();
      }
    };
    $scope.stop = function () {
      $scope.drumkit.handleStop();
    };

    $scope.toggleBeat = function (instrument, beat) {
      active = $scope.drumkit.rhythm[instrument].beat[beat];
      var beatActive = $scope.drumkit.rhythm[instrument].beat[beat] = active ? 0 : 1;
      return beatActive;
    };
    $scope.getBeatClass = function (instrument, beat) {
      if ($scope.drumkit.rhythm[instrument].beat[beat]) {return 'active';}
    };
    $scope.$watch('kit', function() {
      console.log($scope.kit);
      return $scope.loadKit();
    });
    $scope.$watch('tempo', function () {
      $scope.drumkit.tempo = $scope.tempo;
    });
    $scope.loadRhythm(0);
  });
