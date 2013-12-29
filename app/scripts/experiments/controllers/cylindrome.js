'use strict';

angular.module('mctApp')
  .controller('CylindromeCtrl', function ($scope) {
    var Block;
    var cylindromeDiv = angular.element(document.getElementById('cylindrome'))[0];

    var theta = 0;
    $scope.advance = function (amount) {
      theta += (360 / 9) * amount * -1;
      cylindromeDiv.style['-webkit-transform'] = 'translateZ(-288px) rotateY(' + theta +'deg)';
    };
    var height = cylindromeDiv.clientHeight;
    var width = cylindromeDiv.clientWidth;
    var maxColumn = 16;
    var maxRow = 1;
    var offset = 25;

    var dx = (width - 2 * offset) / maxColumn;
    var dy = (height - 2 * offset) / maxRow;


    var blocks = [];

    function index (column, row) {
      return column + (row * maxColumn);
    }
    function addBlock(column, row) {
      var block = new Block(column, row);
      blocks[index(column, row)] = block;
      return block;
    }

    $scope.init = function () {
      var i, j;
      for (i = 0; i < maxRow; i++) {
        for (j = 0; j < maxColumn; j++) {
          addBlock(j, i);
        }
      }
      var fragment = document.createDocumentFragment();
      blocks.forEach(function (block) {
        fragment.appendChild(block.createElement());
      });
      cylindromeDiv.appendChild(fragment);
    };
    Block = function (column, row) {
      this.column = column;
      this.row = row;
      this.index = index(column, row);
      
    };
    Block.prototype = {
      createElement: function () {
        var div = document.createElement('div');
        div.className = 'block';
        var cssString = createCssString({
          position: 'absolute',
          top: this.row * dy + offset + 'px',
          left: this.column * dx + offset + 'px',
          border: '1px solid black',
          width: dx + 'px',
          height: dy + 'px',
          '-webkit-transform': 'rotateY(90deg)',
        });
        div.style.cssText = cssString;
        return div;
      },
    };

    function createCssString (css) {
      var string;
      var options = [];
      for (var option in css) {
        if (css.hasOwnProperty(option)) {
          var value = css[option];
          options.push(''+option+': ' + value + ';');
        }
      }
      return options.join(' ');
    }

  });
