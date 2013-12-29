'use strict';

angular.module('mctApp')
  .directive('threejs', function () {
    return {
      template: '<div class="threejs"></div>',
      restrict: 'E',
      replace: true,
      link: function postLink(scope, element, attrs) {
        function render() {
          if (!scope.molecule) { return; }
          console.log(scope.molecule);
          var renderer = new THREE.WebGLRenderer();
          var width = attrs.width;
          var height = attrs.height;
          renderer.setSize(width, height);
          console.log(element);
          element.empty();
          element.append(renderer.domElement);
          var scene = new THREE.Scene();

          var camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
          camera.position.z = 100;

          for (var i = 0; i < scope.molecule.atoms.length; i++) {
            var atom = scope.molecule.atoms[i];
            console.log(atom);
            var sphere = new THREE.Mesh(new THREE.SphereGeometry(8, 10, 10), new THREE.MeshNormalMaterial());
            sphere.position.x = atom.x * width;
            sphere.position.y = atom.y * height;
            sphere.position.z = 0;
            sphere.overdraw = true;
            console.log(sphere);
            scene.add(sphere);
          }
          renderer.render(scene, camera);
          console.log(scene);

           
          var animFrame = window.requestAnimationFrame(render);
        }
        scope.$watch('molecule', render);
      }
    };
  });
