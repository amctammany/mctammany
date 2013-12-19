'use strict';

angular.module('mctApp', ['ngRoute', 'ngSanitize', 'ngResource'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/posts', {
        templateUrl: 'views/posts/index.html',
        controller: 'PostsCtrl'
      })
      .when('/posts/new', {
        templateUrl: 'views/posts/new.html',
        controller: 'NewPostCtrl'
      })
      .when('/posts/:name', {
        templateUrl: 'views/posts/show.html',
        controller: 'ShowPostCtrl'
      })
      .when('/posts/:name/edit', {
        templateUrl: 'views/posts/edit.html',
        controller: 'EditPostCtrl'
      })
      .when('/molecules', {
        templateUrl: 'views/molecules/index.html',
        controller: 'MoleculesCtrl'
      })
      .when('/molecules/new', {
        templateUrl: 'views/molecules/sketcher.html',
        controller: 'MoleculeSketcherCtrl'
      })
      .when('/molecules/:name', {
        templateUrl: 'views/molecules/show.html',
        controller: 'ShowMoleculeCtrl'
      })
      .when('/molecules/:name/edit', {
        templateUrl: 'views/molecules/sketcher.html',
        controller: 'MoleculeSketcherCtrl'
      })
      .when('/experiments/balldrop', {
        templateUrl: 'views/experiments/balldrop.html',
        controller: 'BallDropCtrl'
      })
      .when('/experiments/maze', {
        templateUrl: 'views/experiments/maze.html',
        controller: 'MazeCtrl'
      })
      .when('/experiments/marbles', {
        templateUrl: 'views/experiments/marbles.html',
        controller: 'MarblesCtrl'
      })
      .when('/experiments/scrabble', {
        templateUrl: 'views/experiments/scrabble.html',
        controller: 'ScrabbleCtrl'
      })
      .when('/mc2', {
        templateUrl: 'views/mc2/mc2.html',
        controller: 'Mc2Ctrl'
      })
      .when('/mc2/ballistics', {
        templateUrl: 'views/mc2/ballistics.html',
        controller: 'BallisticsCtrl'
      })
      .when('/mc2/spring', {
        templateUrl: 'views/mc2/spring.html',
        controller: 'SpringCtrl'
      })
      .when('/mc2/cloth', {
        templateUrl: 'views/mc2/cloth.html',
        controller: 'ClothCtrl'
      })
      .when('/mc2/collisions', {
        templateUrl: 'views/mc2/collisions.html',
        controller: 'CollisionsCtrl'
      })
      .when('/music', {
        templateUrl: 'views/music/music.html',
        controller: 'MusicCtrl'
      })
      .when('/music/tuner', {
        templateUrl: 'views/music/tuner.html',
        controller: 'TunerCtrl'
      })
      .when('/music/drumkit', {
        templateUrl: 'views/music/drumkit.html',
        controller: 'DrumkitCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
