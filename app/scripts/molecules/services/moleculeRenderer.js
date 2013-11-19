'use strict';

angular.module('mctApp')
  .factory('MoleculeRenderer', function () {
    // browsers
    var USER_AGENT = navigator.userAgent.toLowerCase();
     
    var IS_OPERA   = USER_AGENT.indexOf('opera') !== -1;
    var IS_FIREFOX = USER_AGENT.indexOf('firefox') !== -1 || USER_AGENT.indexOf('minefield') !== -1;
    var IS_CHROME  = USER_AGENT.indexOf('chrom') !== -1;
    var IS_SAFARI  = USER_AGENT.indexOf('safari') !== -1 && !IS_CHROME;
     
    var IS_MAC     = USER_AGENT.indexOf('os x') !== -1 || USER_AGENT.indexOf('macintosh') !== -1;
    var BONDS_COLOR = [100,100,100];
    var ATOMS_COLOR = [255,0,0];
    var BACKGROUND_COLOR = [255,255,255];
    var BACKGROUND_COLOR_RGB = 'rgb('+BACKGROUND_COLOR[0]+','+BACKGROUND_COLOR[1]+','+BACKGROUND_COLOR[2]+')';



    function clamp (val, min, max) {
      if (val < min) {return min;}
      if (val > max) {return max;}
      return val;
    }

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
      var cos = Math.cos([angles[0]]);
      var sin = Math.sin([angles[0]]);

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


  // Canvas Rendering {
    function refreshBackground (ctx, width, height, color) {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, width, height);
    }

    function point3d (ctx, x, y, z, radius) {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 6.28, 0);
      ctx.fill();
    }
    function string3d (ctx, string, x, y, z, radius) {
      ctx.font = (2.4*radius) + 'px Arial';
      ctx.fillText(string, x - 0.7 * radius, y + 0.7 * radius);
    }
    function line3d (ctx, x1, y1, z1, x2, y2, z2, scolor, ecolor, bondsGradient) {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.closePath();

      if (bondsGradient) {
        var linGrad = ctx.createLinearGradient(x1, y1, x2, y2);
        linGrad.addColorStop(0.0, scolor);
        linGrad.addColorStop(1.0, ecolor);
        ctx.strokeStyle = linGrad;
      } else {
        ctx.strokeStyle = scolor;
      }
      ctx.stroke();
    }
    function renderMolecule (ctx, cx, cy, width, height, atoms, bonds, drawAtoms, drawBonds, bondsColor, bondsAutoWidth, bondsGradient, atomColors, atomRadius, flatShading, sphereShading, lettersShading, zBack, zRange) {
      var r, g, b, r1, g1, b1, r2, g2, b2;
      var c1, c2, col1, col2, elcol, x, y, z, d;
      var x1, y1, z1, x2, y2, z2;
      var s, dx, dy, dz, l;
      var grad, half, size;
      var dxx, dyy, dd, fi;

      var atomMarginCoeff = 0.85;
      if (lettersShading) {atomMarginCoeff = 1.2;}

      // Z-Sort Atoms + Bonds
      var elements = [];
      for (var i = 0; i < atoms.length; i++) {
        elements.push([atoms[i][2], 0, i]);
      }
      for (i = 0; i < bonds.length; i++) {
        var midpoint = 0.5*(atoms[bonds[i][0]][2] + atoms[bonds[i][1]][2]);
        elements.push([midpoint, 1, i, bonds[i][2]]);
      }
      elements.sort( function (a, b) {
        return a[0] - b[0];
      } );

      for (i = 0; i < elements.length; i++) {

        // Render Atoms

        if (drawAtoms && elements[i][1] === 0) {
          x = cx + atoms[elements[i][2]][0];
          y = cy + atoms[elements[i][2]][1];

          // Cull Atoms outside Canvas
          if (x >= -atomRadius && x <= width + atomRadius && y >= -atomRadius && y <= height + atomRadius) {
            // Set Color via Depth
            z = atoms[elements[i][2]][2];
            col1 = clamp(Math.round(255 * (z - zBack) / zRange), 0, 255);
            if (atomColors) {
              elcol = atoms[elements[i][2]][3];
              r1 = elcol[0];
              g1 = elcol[1];
              b1 = elcol[2];
            } else {
              r1 = ATOMS_COLOR[0];
              g1 = ATOMS_COLOR[1];
              b1 = ATOMS_COLOR[2];
            }

            r2 = BACKGROUND_COLOR[0];
            g2 = BACKGROUND_COLOR[1];
            b2 = BACKGROUND_COLOR[2];

            d = (255 - col1) / 255;
            r = Math.round(r1 + d*(r2 - r1));
            g = Math.round(g1 + d*(g2 - g1));
            b = Math.round(b1 + d*(b2 - b1));

            if (lettersShading) {
              ctx.fillStyle = 'rgb('+r+','+g+','+b+')';
              string3d(ctx, atoms[elements[i][2]][4], x, y, z, (0.5 * col1 / 512) * atomRadius);
            } else if (flatShading) {
              ctx.fillStyle = 'rgb('+r+','+g+','+b+')';
              point3d(ctx, x, y, z, (0.5+col1/512) * atomRadius);
            } else if (sphereShading) {
              half = (0.5 + col1 / 512) * atomRadius;
              size = 2 * half;
              grad = ctx.createRadialGradient(x - half + size * 0.34, y - half + size * 0.7, size * 0.15, x, y, half );
              grad.addColorStop(0, 'rgb('+r+','+b+','+g+')');
              grad.addColorStop(0.95, 'rgba(0,0,0,1.0)');
              grad.addColorStop(1, 'rgba(0,0,0,0)');

              ctx.fillStyle = grad;

              if (IS_SAFARI) {
                point3d(ctx, x, y, z, (0.5 + col1/512) * atomRadius);
              } else {
                ctx.fillRect(x-half, y-half, size, size);
              }
            } else {
              dx = atomRadius * 1.5;
              if (IS_OPERA) {
                grad = ctx.createRadialGradient(x+dx, y+dx, 1, x, y, atomRadius);
                grad.addColorStop(0.0, 'rgb(0,0,0)');
                grad.addColorStop(1.0, 'rgb('+r+','+g+','+b+')');
              } else {
                grad = ctx.createRadialGradient(x, y, atomRadius, x+dx, y+dx, 1);
                grad.addColorStop(0.0, 'rgb('+r+','+g+','+b+')');
                grad.addColorStop(1.0, 'rgb(0,0,0)');
              }
              ctx.fillStyle = grad;
              point3d(ctx, x, y, z, (0.5 + col1/512) * atomRadius);
            }
          } else if (drawBonds && elements[i][1] === 1) {
            x1 = atoms[bonds[elements[i][2]][0]][0] + cx;
            y1 = atoms[bonds[elements[i][2]][0]][1] + cy;
            z1 = atoms[bonds[elements[i][2]][0]][2];
            x2 = atoms[bonds[elements[i][2]][1]][0] + cx;
            y2 = atoms[bonds[elements[i][2]][1]][1] + cy;
            z2 = atoms[bonds[elements[i][2]][1]][2];

            col1 = clamp(Math.round(255 * (z1 - zBack) / zRange), 0, 255);
            col2 = clamp(Math.round(255 * (z2 - zBack) / zRange), 0, 255);

            if (bondsAutoWidth) {
              ctx.lineWidth = 0.1 + col1 / 120.0;
            }

            dx = x2 - x1;
            dy = y2 - y1;
            dz = z2 - z1;
            l = Math.sqrt(dx*dx + dy*dy + dz*dz);

            if (drawAtoms) {
              s = atomMarginCoeff * atomRadius * dx / l;
              x1 += s;
              x2 -= s;

              s = atomMarginCoeff * atomRadius * dy / l;
              y1 += s;
              y2 -= s;
            }

            r = bondsColor[0];
            g = bondsColor[1];
            b = bondsColor[2];

            c1 = 'rgba('+r+','+g+','+b+','+col1/255+')';
            c2 = 'rgba('+r+','+g+','+b+','+col2/255+')';
            
            // First Bond
            line3d(ctx, x1, y1, z1, x2, y2, z2, c1, c2, bondsGradient);

            // Second and Third Bonds
            if (elements[i][3] > 1) {
              dd = 0.35 * atomRadius;
              fi = Math.atan2(dy, dx) - 1.5;
              dxx = dd * Math.cos(fi);
              dyy = dd * Math.sin(fi);

              if (!drawAtoms) {
                s = 0.6 * atomRadius * dx / l;
                x1 += s;
                x2 -= s;

                s = 0.6 * atomRadius * dy / l;
                y1 += s;
                y2 -= s;
              }

              if (elements[i][3] === 2) {
                line3d(ctx, x1 + dxx, y1 + dyy, z1, x2 + dxx, y2 + dyy, z2, c1, c2, bondsGradient);
              } else if (elements[i][3] === 2) {
                line3d(ctx, x1 + dxx, y1 + dyy, z1, x2 + dxx, y2 + dyy, z2, c1, c2, bondsGradient);
                line3d(ctx, x1 - dxx, y1 - dyy, z1, x2 - dxx, y2 - dyy, z2, c1, c2, bondsGradient);
              }
            }
          }
        }
      }
    }


  // }
    //
    function Molecule (config) {
      this.mdiv = config.mdiv;
      this.canvas = document.getElementById(config.canvasId);
      this.ctx = this.canvas.getContext('2d');
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.cx = this.width / 2;
      this.cy = this.height / 2;
    
      this.angles = [0,0,0];
      this.atoms = config.atoms;
      this.bonds = config.bonds;

      this.atomColors = ATOMS_COLOR;
      this.bondsColor = BONDS_COLOR;

      this.autoRotation = [0,0,0];
      this.drawAtoms = config.drawAtoms || true;
      this.drawBonds = config.drawBonds || false;

      this.bondsAutoWidth = config.bondsAutoWidth || true;
      this.bondsGradient = config.bondsGradient || true;
      this.sphereShading = true;


      this.render = function () {
        console.log(this.bonds);
        refreshBackground(this.ctx, this.width, this.height, BACKGROUND_COLOR_RGB);
        renderMolecule(this.ctx, this.cx, this.cy, this.width, this.height,
                      this.atoms, this.bonds, this.drawAtoms, this.drawBonds,
                      this.bondsColor, this.bondsAutoWidth, this.bondsGradient,
                      this.atomColors, this.atomRadius,
                      this.flatShading, this.sphereShading, this.lettersShading,
                      this.zBack, this.zRange);
        console.log(rotate());
        console.log(IS_OPERA);
        console.log(IS_FIREFOX);
        console.log(IS_MAC);
        console.log(rotate());
        console.log(bbox());
        console.log(translate());
        console.log(rescale());
        // scale();
        //bbox();

      };

    }
    var MoleculeRenderer = function (atoms, bonds) {
      var points = [];
      console.log(bonds);
      for (var i = 0; i < atoms.length; i++) {
        var atom = atoms[i];
        points.push([parseFloat(atom.x), parseFloat(atom.y), parseFloat(atom.z)]);
      }
      this.molecule = new Molecule({
        atoms: points,
        bonds: bonds,
        canvasId: 'moleculeCanvas'
      });
      this.molecule.render();
      console.log(this.molecule);

    
    };

    return MoleculeRenderer;
  
  });
