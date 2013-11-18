'use strict';

angular.module('mctApp')
  .controller('PostsCtrl', function ($scope, $filter, Post, Tag) {
    $scope.query = '';
    $scope.selectedTags = [];
    $scope.demoPosts = [
      {title: 'First Post', content: 'Foo!', tags: ['JS', 'Linux']},
      {title: 'Second Post', content: 'Foo!', tags: ['Python', 'Linux']},
      {title: 'Third Post', content: 'Foo!', tags: ['JS', 'Ubuntu']},
    ];
    $scope.posts = Post.query();
    $scope.tags = Tag.query();

    $scope.getPosts = function () {
      return $filter('tagFilter')($scope.posts, $scope.selectedTags);
    };
    
    var converter = new Showdown.converter();
    $scope.getTagClass = function (tag) {
      var status = $scope.selectedTags.indexOf(tag) >= 0 ? 'active' : '';
      return status;
    };
    $scope.toggleTag = function (tag) {
      var index = $scope.selectedTags.indexOf(tag);
      if (index >= 0) {
        $scope.selectedTags.splice(index, 1);
      } else {
        $scope.selectedTags.push(tag);
      }
      console.log($scope.selectedTags);
    };
    $scope.parseContent = function (text) {
      return converter.makeHtml(text);
    };
  });
