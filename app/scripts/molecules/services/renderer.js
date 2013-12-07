'use strict';

angular.module('mctApp')
  .factory('Renderer', function () {
    // Geometry {
    // Bounding Box {
    function bbox (points) {
      if (points.length > 0) {
        var minX = points[0][0];
        var maxX = minX;
        var minY = points[0][1];
        var maxY = minY;
        var minZ = points[0][2];
        var maxZ = minZ;

        for (var i = 1; i < points.length; i++) {
          if (points[i][0] < minX) {
            minX = points[i][0];
          } else if (points[i][0] > maxX) {
            maxX = points[i][0];
          }
          if (points[i][1] < minY) {
            minX = points[i][1];
          } else if (points[i][1] > maxY) {
            maxX = points[i][1];
          }
          if (points[i][2] < minZ) {
            minX = points[i][2];
          } else if (points[i][2] > maxZ) {
            maxX = points[i][2];
          }
          return {
            x: [minX, maxX],
            y: [minY, maxY],
            z: [minZ, maxZ]
          };
        }
      } else {
        return {
          x: [0,0],
          y: [0,0],
          z: [0,0]
        };
      }
    }
    // }

    function translate (points, dx, dy, dz) {
      for (var i = 0; i < points.length; i++) {
        points[i][0] += dx;
        points[i][1] += dy;
        points[i][2] += dz;
      }
    }

    function rescale (points, scale) {
      for (var i = 0; i < points.length; i++) {
        points[i][0] *= scale;
        points[i][1] *= scale;
        points[i][2] *= scale;
      }
    }
    function rotate (src, dst, angles) {
      var size = src.length;

      // X-Axis
      var cos = Math.cos(angles[0]);
      var sin = Math.sin(angles[0]);

      for (var i = 0; i < size; i++) {
        dst[i][0] = src[i][0];
        dst[i][1] = src[i][1] * cos - src[i][2] * sin;
        dst[i][2] = src[i][1] * sin + src[i][2] * cos;
      }

      // Y-Axis
      cos = Math.cos(angles[1]);
      sin = Math.sin(angles[1]);

      var a, b;
      for (i = 0; i < size; i++) {
        a = dst[i][0] * cos - dst[i][2] * sin;
        b = dst[i][0] * sin + dst[i][2] * cos;
        dst[i][0] = a;
        dst[i][2] = b;
      }

      // Z-Axis
      cos = Math.cos(angles[2]);
      sin = Math.sin(angles[2]);

      for (i = 0; i < size; i++) {
        a = dst[i][0] * cos - dst[i][1] * sin;
        b = dst[i][0] * sin + dst[i][1] * cos;
        dst[i][0] = a;
        dst[i][1] = b;
      }
    
    }
    // }

    var Renderer = function (molecule, canvasId) {
      this.molecule = molecule;
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext('2d');
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.bgColor = 'white';

      this.cx = this.width / 2;
      this.cy = this.height / 2;

      this.angles = [0, 0, 0];

      this.rotX = 0.01;
      this.rotY = 0.01;
      this.rotZ = 0.01;

      this.points = [];
      this.atoms = this.molecule.getVertices();
      for (var i = 0; i < this.atoms.length; i++) {
        this.points[i] = [];
        this.points[i][0] = this.atoms[i][0];
        this.points[i][1] = this.atoms[i][1];
        this.points[i][2] = this.atoms[i][2];
      }
      this.lines = this.molecule.getLines();
      this.bbox = bbox(this.points);
      this.minX = this.bbox.x[0];
      this.maxX = this.bbox.x[1];
      this.minY = this.bbox.y[0];
      this.maxY = this.bbox.y[1];
      this.minZ = this.bbox.z[0];
      this.maxZ = this.bbox.z[0];
      this.animationFrameId = 0;
    };

    Renderer.prototype.rescale = function (scale) {
      rescale(this.points, 0.5);
      this.render();
    };
    Renderer.prototype.rotate = function () {
      this.angles[0] += this.rotX;
      this.angles[1] += this.rotY;
      this.angles[2] += this.rotZ;
      rotate(this.atoms, this.points, this.angles);
    
    };

    Renderer.prototype.animate = function () {
      var animate = this.animate.bind(this);
      this.rotate();
      this.render();
      this.animationFrameId = window.requestAnimationFrame(animate);
      
    };
    Renderer.prototype.rotateTo = function (x, y, z) {
      this.angles = [x, y, z];
      rotate(this.atoms, this.points, this.angles);
      this.render();
    };
    Renderer.prototype.convertPointToCanvas = function (point) {
      var pt = {
        x: ((point[0] * this.width) / 2) + this.cx,
        y: ((point[1] * this.height) / 2) + this.cy,
      };
      return pt;

    };
    Renderer.prototype.render = function () {
      this.refreshBackground();
      var ctx = this.ctx;
      ctx.fillStyle = 'black';
      var self = this;
      this.points.forEach(function (pt) {
        var p = self.convertPointToCanvas(pt);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 8, 0, 6.28, 0);
        ctx.fill();
      });
      this.lines.forEach(function (line) {
        var p1 = self.convertPointToCanvas(self.points[line[0]]);
        var p2 = self.convertPointToCanvas(self.points[line[1]]);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });
    };

    Renderer.prototype.refreshBackground = function () {
      this.ctx.fillStyle = this.bgColor;
      this.ctx.fillRect(0, 0, this.width, this.height);
    };

    Renderer.prototype.drawPoint = function (x, y, z, radius) {
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, 6.28, 0);
      this.ctx.fill();
    };

    return Renderer;
  
  });
