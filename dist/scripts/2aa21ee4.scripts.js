"use strict";angular.module("mctApp",["ngRoute","ngSanitize","ngResource"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/posts",{templateUrl:"views/posts/index.html",controller:"PostsCtrl"}).when("/posts/new",{templateUrl:"views/posts/new.html",controller:"NewPostCtrl"}).when("/posts/:name",{templateUrl:"views/posts/show.html",controller:"ShowPostCtrl"}).when("/posts/:name/edit",{templateUrl:"views/posts/edit.html",controller:"EditPostCtrl"}).when("/molecules",{templateUrl:"views/molecules/index.html",controller:"MoleculesCtrl"}).when("/molecules/new",{templateUrl:"views/molecules/sketcher.html",controller:"MoleculeSketcherCtrl"}).when("/molecules/:name",{templateUrl:"views/molecules/show.html",controller:"ShowMoleculeCtrl"}).when("/molecules/:name/edit",{templateUrl:"views/molecules/sketcher.html",controller:"MoleculeSketcherCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("mctApp").controller("MainCtrl",["$scope","$location",function(a,b){a.$location=b,a.$watch("$location.path()",function(b){a.activeNavId=b||"/"}),a.getClass=function(b){return a.activeNavId?a.activeNavId.substring(0,b.length)===b?"active":"":void 0}}]),angular.module("mctApp").controller("AppCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("mctApp").factory("Post",["$resource",function(a){return a("posts/:name",{name:"@urlString"},{})}]),angular.module("mctApp").factory("Tag",["$resource",function(a){return a("tags/:name",{name:"@urlString"},{})}]),angular.module("mctApp").filter("tagFilter",function(){return function(a,b){function c(a){return function(b){a.push(b.name)}}if(b.length<1)return a;if(a.$resolved){var d=[];console.log(a.length);for(var e=0;e<b.length;e++)for(var f=b[e],g=0;g<a.length;g++){var h=a[g],i=[],j=c(i);h.tags.map(j),i.indexOf(f)>=0&&d.push(h)}return d}}}),angular.module("mctApp").controller("PostsCtrl",["$scope","$filter","Post","Tag",function(a,b,c,d){a.query="",a.selectedTags=[],a.demoPosts=[{title:"First Post",content:"Foo!",tags:["JS","Linux"]},{title:"Second Post",content:"Foo!",tags:["Python","Linux"]},{title:"Third Post",content:"Foo!",tags:["JS","Ubuntu"]}],a.posts=c.query(),a.tags=d.query(),a.getPosts=function(){return b("tagFilter")(a.posts,a.selectedTags)};var e=new Showdown.converter;a.getTagClass=function(b){var c=a.selectedTags.indexOf(b)>=0?"active":"";return c},a.toggleTag=function(b){var c=a.selectedTags.indexOf(b);c>=0?a.selectedTags.splice(c,1):a.selectedTags.push(b),console.log(a.selectedTags)},a.parseContent=function(a){return e.makeHtml(a)}}]),angular.module("mctApp").controller("NewPostCtrl",["$scope","$location","Post",function(a,b,c){a.post={title:"",tags:null,content:""},a.preview="";var d=new Showdown.converter;a.$watch("post.content",function(){a.post.content&&(a.preview=d.makeHtml(a.post.content))}),a.parseContent=function(b){b&&(a.preview=d.makeHtml(b))},a.savePost=function(){var d=new c(a.post);d.$save(),b.path("/posts")}}]),angular.module("mctApp").controller("EditPostCtrl",["$scope","$location","$routeParams","Post",function(a,b,c,d){a.post=d.get({name:c.name});var e=new Showdown.converter;a.$watch("post.content",function(){a.post.content&&(a.preview=e.makeHtml(a.post.content))}),a.savePost=function(){a.post.$save(),b.path("/posts")}}]),angular.module("mctApp").controller("ShowPostCtrl",["$scope","$location","$routeParams","Post",function(a,b,c,d){a.post=d.get({name:c.name});var e=new Showdown.converter;a.$watch("post.content",function(){a.post.content&&(a.content=e.makeHtml(a.post.content))}),a.editPost=function(){b.path("/posts/"+a.post.urlString+"/edit")},a.deletePost=function(){a.post.$delete(),b.path("/posts")}}]),angular.module("mctApp").factory("Molecule",["Atom","Bond",function(a,b){var c;return c=function(a,b,c){this.name=a,this.molFile=b,this.ctx=c,this.atoms=[],this.bonds=[],this.selection=[],this.selectedAtom=null,this.selectedBond=null,this.dirty=!1},c.prototype.copy=function(){var a=new c(this.name);a.atoms=this.atoms,a.bonds=this.bonds,console.log(a)},c.prototype.clearSelection=function(){for(var a=0;a<this.selection.length;a++){var b=this.selection[a];b.deselect()}this.selection.splice(0,this.selection.length)},c.prototype.changeSelection=function(a){this.clearSelection();for(var b=0;b<a.length;b++){var c=a[b];c.select(),this.selection.push(c)}},c.prototype.draw=function(){if(this.ctx){var a=this;this.ctx.clearRect(0,0,500,500),this.bonds.map(function(b){b.draw(a.ctx)}),this.atoms.map(function(b){b.draw(a.ctx)})}},c.prototype.findNearestObject=function(a,b,c){var d,e=this.findNearestAtom(a,b,c),f=this.findNearestBond(a,b,c);return d=e.distance<1.5*f.distance?{obj:e.atom,score:e.distance}:{obj:f.bond,score:f.distance}},c.prototype.findNearestAtom=function(a,b,c){for(var d,e=999,f=this.atoms.length,g=0;f>g;g++){var h=this.atoms[g],i=h.distanceFrom(a,b,c);e>i&&(e=i,d=h)}return{atom:d,distance:e}},c.prototype.findNearestBond=function(a,b,c){for(var d,e=999,f=this.bonds.length,g=0;f>g;g++){var h=this.bonds[g],i=h.distanceFrom(a,b,c);e>i&&(e=i,d=h)}return{bond:d,distance:e}},c.prototype.getBoundingBox=function(){var a=this.atoms.map(function(a){return{x:a.x,y:a.y,z:a.z,index:a.index}});a.sort(function(a,b){return a.x-b.x}),this.minX=a[0].x,this.maxX=a[a.length-1].x,a.sort(function(a,b){return a.y-b.y}),this.minY=a[0].y,this.maxY=a[a.length-1].y,a.sort(function(a,b){return a.z-b.z}),this.minZ=a[0].z,this.maxZ=a[a.length-1].z,this.width=this.maxX-this.minX,this.cx=this.minX+this.width/2,this.height=this.maxY-this.minY,this.cy=this.minY+this.height/2,this.depth=this.maxZ-this.minZ,console.log(this.depth),this.cz=this.minZ+this.depth/2,this.depth=0===this.depth?1:this.depth},c.prototype.getLines=function(){for(var a=[],b=0;b<this.bonds.length;b++){var c=this.bonds[b];a.push([c.startAtom.index,c.endAtom.index,1])}return a},c.prototype.getVertices=function(){this.getBoundingBox();for(var a=[],b=0;b<this.atoms.length;b++){var c=this.atoms[b],d={x:0,y:0,z:0};d.x=(c.x-this.cx)/this.width,d.x=d.x.toFixed(3),d.y=(c.y-this.cy)/this.height,d.y=d.y.toFixed(3),d.z=(c.z-this.cz)/this.depth,d.z=d.z.toFixed(3),d.z=d.z?d.z:1,a.push([d.x,d.y,d.z])}return a},c.prototype.normalize=function(){for(var a=0;a<this.atoms.length;a++){var b=this.atoms[a];b.x=b.x-(this.minX+this.width)/2,b.x=b.x/(1*this.width/2),b.x=b.x.toFixed(3),b.y=b.y-(this.minY+this.height)/2,b.y=b.y/(1*this.height/2),b.y=b.y.toFixed(3),b.z=b.z-(this.minZ+this.depth)/2,b.z=b.z/(1*this.depth/2),b.z=b.z?b.z:1,b.z=b.z.toFixed(3),b.z=1}},c.prototype.satisfy=function(a){var b;for(b=0;b<this.bonds.length;b++){var c=this.bonds[b];c.satisfy(a)}},c.prototype.addAtom=function(b,c,d,e){var f=new a(b,c,d,e,this);return this.draw(),this.dirty=!0,f},c.prototype.addBond=function(a,c,d){var e=new b(a,c,d,this);return this.draw(),e},c.prototype.generateMolFile=function(){var a=this.atoms.length,b=this.bonds.length,c=[];c.push(a+" "+b);for(var d=0;a>d;d++){var e=this.atoms[d];c.push([e.element,e.x,e.y,e.z].join(" "))}for(var f=0;b>f;f++){var g=this.bonds[f];c.push([g.startAtom.index,g.endAtom.index,g.order].join(" "))}var h=c.join("\n");return this.molFile=h,h},c.prototype.parseMolFile=function(){var c,d,e,f=this.molFile.split("\n"),g=f[0].split(" "),h=parseInt(g[0],10),i=parseInt(g[1],10);for(e=0;h>e;e++){c=f[e+1],d=c.split(" ");var j=d[0],k=parseFloat(d[1]),l=parseFloat(d[2]),m=parseFloat(d[3]);new a(j,k,l,m,this)}for(e=0;i>e;e++){c=f[e+h+1],d=c.split(" ");var n=parseInt(d[0],10),o=this.atoms[n],p=parseInt(d[1],10),q=this.atoms[p],r=parseInt(d[2],10);new b(o,q,r,this)}},c}]),angular.module("mctApp").factory("Atom",function(){var a;return a=function(a,b,c,d,e){this.element=a,this.x=b,this.y=c,this.z=d,this.molecule=e,this.molecule.atoms.push(this),this.index=this.molecule.atoms.indexOf(this),this.bonds=[]},a.prototype.select=function(){this.molecule.selectedAtom&&this.molecule.selectedAtom.deselect(),this.molecule.selectedAtom=this},a.prototype.deselect=function(){this.molecule.selectedAtom=!1},a.prototype.distanceFrom=function(a,b,c){var d=this.x-a,e=this.y-b,f=this.z-c,g=Math.sqrt(d*d+e*e+f*f);return g},a.prototype.change=function(){},a.prototype.draw=function(a){a.fillStyle="white",a.fillRect(this.x-5,this.y-5,15,12),a.fill(),a.beginPath(),a.fillStyle=this.molecule.selectedAtom===this?"red":"black",a.fillText(this.element,this.x-2,this.y+5),a.closePath(),a.fill()},a.prototype.bondTo=function(a){var b=this.molecule.addBond(this,a,1);return b},a.prototype.shift=function(a,b,c){this.x=this.x+a,this.y=this.y+b,this.z=this.z+c},a}),angular.module("mctApp").factory("Bond",function(){var a;return a=function(a,b,c,d){this.startAtom=a,this.startAtom.bonds.push(this),this.endAtom=b,this.endAtom.bonds.push(this),this.order=c,this.restLength=50,this.molecule=d,this.molecule.bonds.push(this),this.index=this.molecule.bonds.indexOf(this)},a.prototype.change=function(){this.order=this.order++%3+1,console.log(this.order)},a.prototype.length=function(){var a=this.endAtom.x-this.startAtom.x,b=this.endAtom.y-this.startAtom.y,c=this.endAtom.z-this.startAtom.z,d=Math.sqrt(a*a+b*b+c*c);return d},a.prototype.distanceFrom=function(a,b,c){var d=(this.startAtom.x-this.endAtom.x)/2+this.endAtom.x,e=(this.startAtom.y-this.endAtom.y)/2+this.endAtom.y,f=(this.startAtom.z-this.endAtom.z)/2+this.endAtom.z,g=d-a,h=e-b,i=f-c,j=Math.sqrt(g*g+h*h+i*i);return j},a.prototype.draw=function(a){a.beginPath(),a.strokeStyle=this.molecule.selectedBond===this?"red":"black";for(var b=1;b<=this.order;b++)a.moveTo(this.startAtom.x+(2*b-1),this.startAtom.y+2*b-1),a.lineTo(this.endAtom.x+2*b-1,this.endAtom.y+2*b-1);a.stroke()},a.prototype.select=function(){this.molecule.selectedBond&&this.molecule.selectedBond.deselect(),this.molecule.selectedBond=this},a.prototype.deselect=function(){this.molecule.selectedBond=!1},a.prototype.shift=function(){},a.prototype.satisfy=function(a){console.log(a)},a}),angular.module("mctApp").factory("MoleculeStore",["$resource",function(a){return a("molecules/:name",{name:"@urlString"})}]),angular.module("mctApp").factory("Renderer",function(){function a(a){if(!(a.length>0))return{x:[0,0],y:[0,0],z:[0,0]};for(var b=a[0][0],c=b,d=a[0][1],e=d,f=a[0][2],g=f,h=1;h<a.length;h++)return a[h][0]<b?b=a[h][0]:a[h][0]>c&&(c=a[h][0]),a[h][1]<d?b=a[h][1]:a[h][1]>e&&(c=a[h][1]),a[h][2]<f?b=a[h][2]:a[h][2]>g&&(c=a[h][2]),{x:[b,c],y:[d,e],z:[f,g]}}function b(a,b){for(var c=0;c<a.length;c++)a[c][0]*=b,a[c][1]*=b,a[c][2]*=b}function c(a,b,c){for(var d=a.length,e=Math.cos([c[0]]),f=Math.sin([c[0]]),g=0;d>g;g++)b[g][0]=a[g][0],b[g][1]=a[g][1]*e-a[g][2]*f,b[g][2]=a[g][1]*f+a[g][2]*e;e=Math.cos(c[1]),f=Math.sin(c[1]);var h,i;for(g=0;d>g;g++)h=b[g][0]*e-b[g][2]*f,i=b[g][0]*f+b[g][2]*e,b[g][0]=h,b[g][2]=i;for(e=Math.cos(c[2]),f=Math.sin(c[2]),g=0;d>g;g++)h=b[g][0]*e-b[g][1]*f,i=b[g][0]*f+b[g][1]*e,b[g][0]=h,b[g][1]=i}var d=function(b,c){this.molecule=b,this.canvas=document.getElementById(c),this.ctx=this.canvas.getContext("2d"),this.width=this.canvas.width,this.height=this.canvas.height,this.bgColor="white",this.cx=this.width/2,this.cy=this.height/2,this.angles=[0,0,0],this.rotX=.01,this.rotY=0,this.rotZ=0,this.points=[],this.atoms=this.molecule.getVertices();for(var d=0;d<this.atoms.length;d++)this.points[d]=[],this.points[d][0]=this.atoms[d][0],this.points[d][1]=this.atoms[d][1],this.points[d][2]=this.atoms[d][2];this.lines=this.molecule.getLines(),this.bbox=a(this.points),this.minX=this.bbox.x[0],this.maxX=this.bbox.x[1],this.minY=this.bbox.y[0],this.maxY=this.bbox.y[1],this.minZ=this.bbox.z[0],this.maxZ=this.bbox.z[0],this.animationFrameId=0};return d.prototype.rescale=function(){b(this.points,.5),this.render()},d.prototype.rotate=function(){this.angles[0]+=this.rotX,this.angles[1]+=this.rotY,this.angles[2]+=this.rotZ,c(this.atoms,this.points,this.angles)},d.prototype.animate=function(){var a=this.animate.bind(this);this.rotate(),this.render(),this.animationFrameId=window.requestAnimationFrame(a)},d.prototype.rotateTo=function(a,b,d){this.angles=[a,b,d],c(this.atoms,this.points,this.angles),this.render()},d.prototype.convertPointToCanvas=function(a){var b={x:a[0]*this.width/2+this.cx,y:a[1]*this.height/2+this.cy};return b},d.prototype.render=function(){this.refreshBackground();var a=this.ctx;a.fillStyle="black";var b=this;this.points.map(function(c){var d=b.convertPointToCanvas(c);a.beginPath(),a.arc(d.x,d.y,8,0,6.28,0),a.fill()}),this.lines.map(function(c){var d=b.convertPointToCanvas(b.points[c[0]]),e=b.convertPointToCanvas(b.points[c[1]]);a.beginPath(),a.moveTo(d.x,d.y),a.lineTo(e.x,e.y),a.stroke()})},d.prototype.refreshBackground=function(){this.ctx.fillStyle=this.bgColor,this.ctx.fillRect(0,0,this.width,this.height)},d.prototype.drawPoint=function(a,b,c,d){this.ctx.beginPath(),this.ctx.arc(a,b,d,0,6.28,0),this.ctx.fill()},d}),angular.module("mctApp").factory("MoleculeRenderer",function(){function a(a,b,c){return b>a?b:a>c?c:a}function b(a){if(!(a.length>0))return{x:[0,0],y:[0,0],z:[0,0]};for(var b=a[0][0],c=b,d=a[0][1],e=d,f=a[0][2],g=f,h=1;h<a.length;h++)return a[h][0]<b?b=a[h][0]:a[h][0]>c&&(c=a[h][0]),a[h][1]<d?b=a[h][1]:a[h][1]>e&&(c=a[h][1]),a[h][2]<f?b=a[h][2]:a[h][2]>g&&(c=a[h][2]),{x:[b,c],y:[d,e],z:[f,g]}}function c(a,b,c,d){for(var e=0;e<a.length;e++)a[e][0]+=b,a[e][1]+=c,a[e][2]+=d}function d(a,b){for(var c=0;c<a.length;c++)a[c][0]*=b,a[c][1]*=b,a[c][2]*=b}function e(a,b,c){for(var d=a.length,e=Math.cos([c[0]]),f=Math.sin([c[0]]),g=0;d>g;g++)b[g][0]=a[g][0],b[g][1]=a[g][1]*e-a[g][2]*f,b[g][2]=a[g][1]*f+a[g][2]*e;e=Math.cos(c[1]),f=Math.sin(c[1]);var h,i;for(g=0;d>g;g++)h=b[g][0]*e-b[g][2]*f,i=b[g][0]*f+b[g][2]*e,b[g][0]=h,b[g][2]=i;for(e=Math.cos(c[2]),f=Math.sin(c[2]),g=0;d>g;g++)h=b[g][0]*e-b[g][1]*f,i=b[g][0]*f+b[g][1]*e,b[g][0]=h,b[g][1]=i}function f(a,b,c,d){a.fillStyle=d,a.fillRect(0,0,b,c)}function g(a,b,c,d,e){a.beginPath(),a.arc(b,c,e,0,6.28,0),a.fill()}function h(a,b,c,d,e,f){a.font=2.4*f+"px Arial",a.fillText(b,c-.7*f,d+.7*f)}function i(a,b,c,d,e,f,g,h,i,j){if(a.beginPath(),a.moveTo(b,c),a.lineTo(e,f),a.closePath(),j){var k=a.createLinearGradient(b,c,e,f);k.addColorStop(0,h),k.addColorStop(1,i),a.strokeStyle=k}else a.strokeStyle=h;a.stroke()}function j(b,c,d,e,f,j,k,l,n,o,q,r,u,v,w,x,y,z,A){var B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,$,_,ab,bb,cb,db,eb,fb,gb,hb,ib,jb=.85;y&&(jb=1.2);for(var kb=[],lb=0;lb<j.length;lb++)kb.push([j[lb][2],0,lb]);for(lb=0;lb<k.length;lb++){var mb=.5*(j[k[lb][0]][2]+j[k[lb][1]][2]);kb.push([mb,1,lb,k[lb][2]])}for(kb.sort(function(a,b){return a[0]-b[0]}),lb=0;lb<kb.length;lb++)l&&0===kb[lb][1]&&(P=c+j[kb[lb][2]][0],Q=d+j[kb[lb][2]][1],P>=-v&&e+v>=P&&Q>=-v&&f+v>=Q?(R=j[kb[lb][2]][2],M=a(Math.round(255*(R-z)/A),0,255),u?(O=j[kb[lb][2]][3],E=O[0],F=O[1],G=O[2]):(E=s[0],F=s[1],G=s[2]),H=t[0],I=t[1],J=t[2],S=(255-M)/255,B=Math.round(E+S*(H-E)),C=Math.round(F+S*(I-F)),D=Math.round(G+S*(J-G)),y?(b.fillStyle="rgb("+B+","+C+","+D+")",h(b,j[kb[lb][2]][4],P,Q,R,.5*M/512*v)):w?(b.fillStyle="rgb("+B+","+C+","+D+")",g(b,P,Q,R,(.5+M/512)*v)):x?(db=(.5+M/512)*v,eb=2*db,cb=b.createRadialGradient(P-db+.34*eb,Q-db+.7*eb,.15*eb,P,Q,db),cb.addColorStop(0,"rgb("+B+","+D+","+C+")"),cb.addColorStop(.95,"rgba(0,0,0,1.0)"),cb.addColorStop(1,"rgba(0,0,0,0)"),b.fillStyle=cb,p?g(b,P,Q,R,(.5+M/512)*v):b.fillRect(P-db,Q-db,eb,eb)):($=1.5*v,m?(cb=b.createRadialGradient(P+$,Q+$,1,P,Q,v),cb.addColorStop(0,"rgb(0,0,0)"),cb.addColorStop(1,"rgb("+B+","+C+","+D+")")):(cb=b.createRadialGradient(P,Q,v,P+$,Q+$,1),cb.addColorStop(0,"rgb("+B+","+C+","+D+")"),cb.addColorStop(1,"rgb(0,0,0)")),b.fillStyle=cb,g(b,P,Q,R,(.5+M/512)*v))):n&&1===kb[lb][1]&&(T=j[k[kb[lb][2]][0]][0]+c,U=j[k[kb[lb][2]][0]][1]+d,V=j[k[kb[lb][2]][0]][2],W=j[k[kb[lb][2]][1]][0]+c,X=j[k[kb[lb][2]][1]][1]+d,Y=j[k[kb[lb][2]][1]][2],M=a(Math.round(255*(V-z)/A),0,255),N=a(Math.round(255*(Y-z)/A),0,255),q&&(b.lineWidth=.1+M/120),$=W-T,_=X-U,ab=Y-V,bb=Math.sqrt($*$+_*_+ab*ab),l&&(Z=jb*v*$/bb,T+=Z,W-=Z,Z=jb*v*_/bb,U+=Z,X-=Z),B=o[0],C=o[1],D=o[2],K="rgba("+B+","+C+","+D+","+M/255+")",L="rgba("+B+","+C+","+D+","+N/255+")",i(b,T,U,V,W,X,Y,K,L,r),kb[lb][3]>1&&(hb=.35*v,ib=Math.atan2(_,$)-1.5,fb=hb*Math.cos(ib),gb=hb*Math.sin(ib),l||(Z=.6*v*$/bb,T+=Z,W-=Z,Z=.6*v*_/bb,U+=Z,X-=Z),2===kb[lb][3]?i(b,T+fb,U+gb,V,W+fb,X+gb,Y,K,L,r):2===kb[lb][3]&&(i(b,T+fb,U+gb,V,W+fb,X+gb,Y,K,L,r),i(b,T-fb,U-gb,V,W-fb,X-gb,Y,K,L,r)))))}function k(a){this.mdiv=a.mdiv,this.canvas=document.getElementById(a.canvasId),this.ctx=this.canvas.getContext("2d"),this.width=this.canvas.width,this.height=this.canvas.height,this.cx=this.width/2,this.cy=this.height/2,this.angles=[0,0,0],this.atoms=a.atoms,this.bonds=a.bonds,this.atomColors=s,this.bondsColor=r,this.autoRotation=[0,0,0],this.drawAtoms=a.drawAtoms||!0,this.drawBonds=a.drawBonds||!1,this.bondsAutoWidth=a.bondsAutoWidth||!0,this.bondsGradient=a.bondsGradient||!0,this.sphereShading=!0,this.render=function(){console.log(this.bonds),f(this.ctx,this.width,this.height,u),j(this.ctx,this.cx,this.cy,this.width,this.height,this.atoms,this.bonds,this.drawAtoms,this.drawBonds,this.bondsColor,this.bondsAutoWidth,this.bondsGradient,this.atomColors,this.atomRadius,this.flatShading,this.sphereShading,this.lettersShading,this.zBack,this.zRange),console.log(e()),console.log(m),console.log(n),console.log(q),console.log(e()),console.log(b()),console.log(c()),console.log(d())}}var l=navigator.userAgent.toLowerCase(),m=-1!==l.indexOf("opera"),n=-1!==l.indexOf("firefox")||-1!==l.indexOf("minefield"),o=-1!==l.indexOf("chrom"),p=-1!==l.indexOf("safari")&&!o,q=-1!==l.indexOf("os x")||-1!==l.indexOf("macintosh"),r=[100,100,100],s=[255,0,0],t=[255,255,255],u="rgb("+t[0]+","+t[1]+","+t[2]+")",v=function(a,b){var c=[];console.log(b);for(var d=0;d<a.length;d++){var e=a[d];c.push([parseFloat(e.x),parseFloat(e.y),parseFloat(e.z)])}this.molecule=new k({atoms:c,bonds:b,canvasId:"moleculeCanvas"}),this.molecule.render(),console.log(this.molecule)};return v}),angular.module("mctApp").controller("NewMoleculeCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("mctApp").controller("MoleculesCtrl",["$scope","MoleculeStore",function(a,b){a.molecules=b.query()}]),angular.module("mctApp").controller("ShowMoleculeCtrl",["$scope","$routeParams","Molecule","MoleculeStore","Renderer",function(a,b,c,d,e){a.moleculeName=b.name,b.name?a.moleculeStore=d.get({name:b.name},function(b){a.molecule=new c(b.name,b.molFile,a.ctx),a.name=a.molecule.name,a.molecule.parseMolFile(),a.renderer=new e(a.molecule,"moleculeCanvas"),a.renderer.animate()}):a.molecule=new c(!1,!1,a.ctx)}]),angular.module("mctApp").controller("EditMoleculeCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("mctApp").controller("MoleculeSketcherCtrl",["$scope","$filter","$location","$routeParams","Molecule","MoleculeStore",function(a,b,c,d,e,f){a.canvas=document.getElementById("chem-sketcher"),a.div=angular.element(document.getElementById("chem-sketcher")),a.ctx=a.canvas.getContext("2d"),d.name?a.moleculeStore=f.get({name:d.name},function(b){a.molecule=new e(b.name,b.molFile,a.ctx),a.name=a.molecule.name,a.molecule.parseMolFile(),a.molecule.draw()}):a.molecule=new e(!1,!1,a.ctx),a.dragging=!1,a.atomTool="C",a.bondTool="1",a.mouseTool=!1,a.mouseTools=["select","group","delete"],a.bondTypes=["1","2","3","d","s"],a.atoms=["C","H","N","O","P","S","B","Si","F","Cl","Br","I"],a.atomGroups=b("groupBy")(a.atoms,6),a.getVertices=function(){var b=a.molecule.getVertices();console.log(b)},a.handleMouseDown=function(b){var c=b.offsetX,d=b.offsetY,e=a.molecule;if(a.mouseTool&&"select"===a.mouseTool){var f=e.findNearestObject(c,d,0);e.changeSelection([f.obj]),a.dragging=!0,a.dragStart={x:c,y:d},e.draw()}},a.handleMouseMove=function(b){var c=b.offsetX,d=b.offsetY,e=a.molecule;if(a.dragging){var f=c-a.dragStart.x,g=d-a.dragStart.y;e.selection.map(function(b){b.shift(f,g,0),a.dragStart.x=c,a.dragStart.y=d}),e.draw()}},a.handleMouseUp=function(b){var c=b.offsetX,d=b.offsetY,e=a.molecule;a.dragging&&(a.dragging=!1);var f=e.findNearestObject(c,d,0);if(a.mouseTool)a.molecule.selection.indexOf(f.obj)>=0&&f.obj.change(),e.changeSelection([f.obj]);else if(a.atomTool&&a.bondTool){var g;g=f.score<15?f.obj:e.addAtom(a.atomTool,c,d,0),e.selectedAtom&&e.selectedAtom.distanceFrom(c,d,0)<75&&e.selectedAtom.bondTo(g),e.changeSelection([g])}e.draw()},a.div.on("mousedown",a.handleMouseDown),a.div.on("mousemove",a.handleMouseMove),a.div.on("mouseup",a.handleMouseUp),a.satisfy=function(){a.molecule.satisfy(.1)},a.changeAtomTool=function(b){a.atomTool=b,a.bondTool=a.bondTool?a.bondTool:"1",a.mouseTool=!1},a.getAtomToolClass=function(b){var c=a.atomTool===b?"active":"";return c},a.changeMouseTool=function(b){a.mouseTool=b,a.atomTool=!1,a.bondTool=!1},a.getMouseToolClass=function(b){var c=a.mouseTool===b?"active":"";return c},a.changeBondTool=function(b){a.bondTool=b,a.mouseTool=!1,a.atomTool=a.atomTool?a.atomTool:"C"},a.getBondToolClass=function(b){var c=a.bondTool===b?"active":"";return c},a.generateMolFile=function(){var b=a.molecule.generateMolFile();console.log(b)},a.saveMolecule=function(){var b=a.molecule.generateMolFile();if(a.moleculeStore)a.moleculeStore.molFile=b,a.moleculeStore.$save();else{var d=new f({name:a.name,molFile:b});d.$save()}c.path("/chemistry/molecules")}}]),angular.module("mctApp").filter("groupBy",function(){return function(a,b){for(var c,d=[],e=0;e<a.length;e++)e%b===0&&(c=[],d.push(c)),c.push(a[e]);return d}});