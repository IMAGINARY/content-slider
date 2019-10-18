(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.IMAGINARY || (g.IMAGINARY = {})).ContentSliderAnnouncer = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).Durden=t()}}(function(){return function s(r,a,o){function u(e,t){if(!a[e]){if(!r[e]){var i="function"==typeof require&&require;if(!t&&i)return i(e,!0);if(h)return h(e,!0);var n=new Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}var l=a[e]={exports:{}};r[e][0].call(l.exports,function(t){return u(r[e][1][t]||t)},l,l.exports,s,r,a,o)}return a[e].exports}for(var h="function"==typeof require&&require,t=0;t<o.length;t++)u(o[t]);return u}({1:[function(t,e,i){"use strict";var n,l=(n=t("./tiling"))&&n.__esModule?n:{default:n};function s(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}var r=function(){function o(t,e,i){var n=3<arguments.length&&void 0!==arguments[3]?arguments[3]:o.MAX_ANGLE;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,o),this.canvas=window.document.createElement("canvas"),t.appendChild(this.canvas),paper.setup(this.canvas),paper.view.applyMatrix=!1,this.tiling=new l.default(e,i),this.bcdeLen=50,this.transformTiles(this.bcdeLen,n,!0),paper.view.update(),paper.view.on("frame",function(){TWEEN.update()})}return function(t,e,i){e&&s(t.prototype,e),i&&s(t,i)}(o,[{key:"getShuffledTiles",value:function(){return o.shuffle(this.tiling.getAllTiles())}},{key:"getShuffledSuperTiles",value:function(){return o.shuffle(this.tiling.getAllSuperTiles())}},{key:"showTilesRandom",value:function(t){return o.setTileVisibilityAnimated(this.getShuffledTiles(),!0,t)}},{key:"showSuperTilesRandom",value:function(t){return o.setTileVisibilityAnimated(this.getShuffledSuperTiles(),!0,t)}},{key:"hideTilesRandom",value:function(t){return o.setTileVisibilityAnimated(this.getShuffledTiles(),!1,t)}},{key:"hideSuperTilesRandom",value:function(t){return o.setTileVisibilityAnimated(this.getShuffledSuperTiles(),!1,t)}},{key:"showTilesOrdered",value:function(t){return o.setTileVisibilityAnimated(this.tiling.getAllTiles(),!0,t)}},{key:"hideTilesOrdered",value:function(t){return o.setTileVisibilityAnimated(this.tiling.getAllTiles(),!1,t)}},{key:"showSuperTilesOrdered",value:function(t){return o.setTileVisibilityAnimated(this.tiling.getAllSuperTiles(),!0,t)}},{key:"hideSuperTilesOrdered",value:function(t){return o.setTileVisibilityAnimated(this.tiling.getAllSuperTiles(),!1,t)}},{key:"setTileVisibility",value:function(e){this.tiling.getAllTiles().forEach(function(t){t.path.opacity=e?1:0})}},{key:"getBounds",value:function(){var t=this.tiling.superTiles[0][0].group.bounds.center,e=this.tiling.superTiles[0][this.tiling.m-1].group.bounds.center,i=this.tiling.superTiles[this.tiling.n-1][0].group.bounds.center,n=this.tiling.superTiles[this.tiling.n-1][this.tiling.m-1].group.bounds.center,l=Math.min(t.x,i.x),s=Math.max(e.x,n.x),r=Math.min(t.y,e.y,i.y,n.y),a=Math.max(t.y,e.y,i.y,n.y);return new paper.Rectangle({from:new paper.Point(l,r),to:new paper.Point(s,a)})}},{key:"transformTilesAnimated",value:function(t,e,i,n){var l=this,s=1<arguments.length&&void 0!==e?e:o.MIN_ANGLE,r=2<arguments.length&&void 0!==i?i:o.MAX_ANGLE,a=3<arguments.length&&void 0!==n&&n;return new TWEEN.Tween({angle:s}).to({angle:r},t).easing(TWEEN.Easing.Sinusoidal.InOut).onUpdate(function(t){l.transformTiles(l.bcdeLen,t.angle,a)}).repeat(1/0).yoyo(!0).start()}},{key:"transformTiles",value:function(t,e,i){var n=2<arguments.length&&void 0!==i&&i;this.tiling.transform(t,e);var l=this.getBounds();n&&(paper.view.getViewSize().width>l.width||(paper.view.getViewSize().height,l.height),paper.view.setScaling(Math.max(paper.view.getViewSize().width/l.width,paper.view.getViewSize().height/l.height))),paper.view.setCenter(l.getCenter())}},{key:"setStroke",value:function(e,i){this.tiling.getAllTiles().forEach(function(t){t.setStroke(e,i)})}},{key:"colorSuperTilesRandom",value:function(i){this.tiling.getAllSuperTiles().forEach(function(t){var e=i[Math.floor(Math.random()*i.length)];t.tile1.path.fillColor=e,t.tile2.path.fillColor=e,t.tile3.path.fillColor=e,t.tile4.path.fillColor=e})}},{key:"colorTilesRandom",value:function(e){this.tiling.getAllTiles().forEach(function(t){t.path.fillColor=e[Math.floor(Math.random()*e.length)]})}},{key:"colorTilesPeriodic",value:function(i){this.tiling.getAllTiles().forEach(function(t,e){t.path.fillColor=i[e%i.length]})}},{key:"colorSuperTilesPeriodic",value:function(i){this.tiling.getAllTiles().forEach(function(t,e){t.path.fillColor=i[Math.floor(e/4)%i.length]})}}],[{key:"shuffle",value:function(t){for(var e=t.length;0!==e;){var i=Math.floor(Math.random()*e),n=t[e-=1];t[e]=t[i],t[i]=n}return t}},{key:"setTileVisibilityAnimated",value:function(n,l,t){var s=0;return new TWEEN.Tween({last:0}).to({last:n.length-1},t).easing(TWEEN.Easing.Cubic.In).onUpdate(function(t){for(var e=Math.floor(t.last),i=s;i<=e;i+=1)n[i].setVisibility(l);s=e}).start()}}]),o}();r.MAX_ANGLE=l.default.MAX_B,r.MIN_ANGLE=l.default.MIN_B,r.Themes={RGB:["#ff9999","#99ff99","#9999ff","#ff99ff"],Spring:["#54678C","#9BDAF2","#F2C12E","#F2E1C2","#D95252"],Flowers:["#D95B96","#BABF1B","#D9981E","#D9751E","#8C1616"],Autumn:["#A62447","#D9326F","#525F43","#6C2A35","#D9936A"],Winter:["#0B0340","#263973","#495F8C","#A0CCF2","#514071"],Christmas:["#F2293A","#F24464","#678C5D","#730202","#BFBFBD"]},e.exports={Durden:r,Themes:r.Themes,MIN_ANGLE:r.MIN_ANGLE,MAX_ANGLE:r.MAX_ANGLE}},{"./tiling":4}],2:[function(t,e,i){"use strict";Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0;var n,l=(n=t("./tile"))&&n.__esModule?n:{default:n};function s(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}var r=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.tile1=new l.default("#ff9999",!1,!1),this.tile2=new l.default("#99ff99",!0,!1),this.tile3=new l.default("#9999ff",!1,!0),this.tile4=new l.default("#ff99ff",!0,!0),this.group=new paper.Group([this.tile1.path,this.tile2.path,this.tile3.path,this.tile4.path]),this.group.applyMatrix=!1}return function(t,e,i){e&&s(t.prototype,e),i&&s(t,i)}(t,[{key:"transform",value:function(t,e){this.tile1.transform(t,e),this.tile2.copyShape(this.tile1,!1),this.tile3.copyShape(this.tile1,!1),this.tile4.copyShape(this.tile1,!1),this.tile2.path.rotate(this.tile1.vE.subtract(this.tile1.vA).getAngle()-this.tile2.vE.subtract(this.tile2.vA).getAngle()),this.tile2.path.translate(this.tile1.vA.subtract(this.tile2.vA)),this.tile3.path.rotate(this.tile1.vE.subtract(this.tile1.vD).getAngle()-this.tile3.vD.subtract(this.tile3.vC).getAngle()),this.tile3.path.translate(this.tile1.vE.subtract(this.tile3.vD)),this.tile4.path.rotate(this.tile3.vE.subtract(this.tile3.vA).getAngle()-this.tile4.vE.subtract(this.tile4.vA).getAngle()),this.tile4.path.translate(this.tile3.vA.subtract(this.tile4.vA))}},{key:"setVisibility",value:function(t){this.tile1.setVisibility(t),this.tile2.setVisibility(t),this.tile3.setVisibility(t),this.tile4.setVisibility(t)}},{key:"copyShape",value:function(t){this.tile1.copyShape(t.tile1),this.tile2.copyShape(t.tile2),this.tile3.copyShape(t.tile3),this.tile4.copyShape(t.tile4)}},{key:"north",get:function(){return this.group.localToParent(this.tile1.vA)}},{key:"nne",get:function(){return this.group.localToParent(this.tile1.vB)}},{key:"nee",get:function(){return this.group.localToParent(this.tile1.vC)}},{key:"south",get:function(){return this.group.localToParent(this.tile3.vA)}},{key:"se",get:function(){return this.group.localToParent(this.tile3.vB)}},{key:"ssw",get:function(){return this.group.localToParent(this.tile4.vB)}},{key:"sww",get:function(){return this.group.localToParent(this.tile4.vC)}},{key:"east",get:function(){return this.group.localToParent(this.tile1.vD)}},{key:"west",get:function(){return this.group.localToParent(this.tile2.vC)}},{key:"nw",get:function(){return this.group.localToParent(this.tile2.vB)}}]),t}();i.default=r},{"./tile":3}],3:[function(t,e,i){"use strict";function n(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0;var l=function(){function l(t){var e=1<arguments.length&&void 0!==arguments[1]&&arguments[1],i=2<arguments.length&&void 0!==arguments[2]&&arguments[2];!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,l),this.path=new paper.Path,this.path.closed=!0,this.path.applyMatrix=!1,this.path.scale(e?-1:1,i?-1:1),this.path.fillColor=t,this.path.strokeColor="#999999",this.path.strokeWidth=1,this.path.strokeJoin="bevel";for(var n=0;n<5;n+=1)this.path.add(new paper.Point(0,0))}return function(t,e,i){e&&n(t.prototype,e),i&&n(t,i)}(l,[{key:"transform",value:function(e,t){var i=this.path.segments,n=360-2*t,l=(180-t)/2,s=2*Math.sin(t/2*Math.PI/180),r=Math.sqrt(s*s+4-2*s*2*Math.cos((n-l)*Math.PI/180)),a=[0,t,n,2*Math.asin(Math.sin((n-l)*Math.PI/180)/r*s)*180/Math.PI],o=0;[1,2,3,4].forEach(function(t){o+=180-a[t-1],i[t].point.set(i[t-1].point.add(new paper.Point({length:e,angle:o})))})}},{key:"setStroke",value:function(t,e){this.path.strokeWidth=t,this.path.strokeColor=e}},{key:"setColor",value:function(t){this.path.fillColor=t}},{key:"setVisibility",value:function(t){this.path.opacity=t?1:0}},{key:"copyShape",value:function(t,e){for(var i=!(1<arguments.length&&void 0!==e)||e,n=1;n<=4;n+=1)this.path.segments[n].point.set(t.path.segments[n].point);i&&this.path.setMatrix(t.path.getMatrix())}},{key:"vA",get:function(){return this.path.localToParent(this.path.segments[0].point)}},{key:"vB",get:function(){return this.path.localToParent(this.path.segments[1].point)}},{key:"vC",get:function(){return this.path.localToParent(this.path.segments[2].point)}},{key:"vD",get:function(){return this.path.localToParent(this.path.segments[3].point)}},{key:"vE",get:function(){return this.path.localToParent(this.path.segments[4].point)}}]),l}();i.default=l},{}],4:[function(t,e,i){"use strict";Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0;var n,s=(n=t("./supertile"))&&n.__esModule?n:{default:n};function r(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}var l=function(){function l(t,e){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,l),this.n=t,this.m=e,this.superTiles=l.createMatrix(this.n,this.m);for(var i=0;i<this.n;i+=1)for(var n=0;n<this.m;n+=1)this.superTiles[i][n]=new s.default,n%2==1&&this.superTiles[i][n].group.scale(1,-1)}return function(t,e,i){e&&r(t.prototype,e),i&&r(t,i)}(l,[{key:"transform",value:function(t,e){var i=this.superTiles[0][0];i.transform(t,e);var n=180-i.tile4.vB.subtract(i.tile1.vC).getAngle(),l=e+i.tile2.vB.subtract(i.tile2.vA).getAngle();this.superTiles[0][0].group.rotation=n;for(var s=0;s<this.n;s+=1)for(var r=0;r<this.m;r+=1)if(0!==s||0!==r){this.superTiles[s][r].copyShape(i),this.superTiles[s][r].group.rotation=r%2==1?n+l:n;var a=[];0<s&&(r%2==1?a.push(this.superTiles[s-1][r].sww.subtract(this.superTiles[s][r].nne)):a.push(this.superTiles[s-1][r].nne.subtract(this.superTiles[s][r].sww))),0<r&&a.push(this.superTiles[s][r-1].south.subtract(this.superTiles[s][r].west)),1===a.length&&this.superTiles[s][r].group.translate(a[0]),2===a.length&&this.superTiles[s][r].group.translate(a[0].add(a[1]).multiply(.5))}}},{key:"getAllTiles",value:function(){var e=[];return this.superTiles.forEach(function(t){t.forEach(function(t){e.push(t.tile1),e.push(t.tile2),e.push(t.tile3),e.push(t.tile4)})}),e}},{key:"getAllSuperTiles",value:function(){var e=[];return this.superTiles.forEach(function(t){t.forEach(function(t){e.push(t)})}),e}}],[{key:"createMatrix",value:function(t,e){for(var i=[],n=0;n<t;n+=1){for(var l=[],s=0;s<e;s+=1)l.push([]);i.push(l)}return i}}]),l}();(i.default=l).MIN_B=74,l.MAX_B=156},{"./supertile":2}]},{},[1])(1)});


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
(function (global){
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.TextPoster = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

/**
 * Places poster-style text inside a container
 *
 * The container will be emptied of whatever children it has (which allows successive invocations).
 *
 * @param {HTMLElement} container
 *  A block element in which to place the text.
 * @param {String} text
 *  The text to typeset
 * @param {Object} options
 *  Options:
 *    - maxLineHeight (default: 0.2) Maximum line height (as a percentage of the block's width)
 *    - minLineHeight (default: 0.044) Minimum line height (as a percentage of the block's width)
 *    - lineSpacing (default: 0) Space, in pixels, to place between lines.
 */
function render(container, text) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var defaultOptions = {
    maxLineHeight: 0.2,
    minLineHeight: 0.044,
    lineSpacing: 0
  };

  var _Object$assign = Object.assign({}, defaultOptions, options),
      maxLineHeight = _Object$assign.maxLineHeight,
      minLineHeight = _Object$assign.minLineHeight,
      lineSpacing = _Object$assign.lineSpacing; // Clear the container


  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  var lineContainer = document.createElement('div');
  lineContainer.classList.add('line-container');
  container.append(lineContainer);
  var lastHeight = 0;
  var lines = text.split('\n').map(function (line) {
    return line.trim();
  }).filter(function (each) {
    return each.length > 0;
  });
  lines.forEach(function (line) {
    var lineText = line;
    var smallText = false; // Check for escape characters

    if (line.substr(0, 2) === '@@') {
      lineText = line.substr(2).trim();
      smallText = true;
    }

    if (lineText.length > 0) {
      var words = lineText.split(' ');
      var fromWord = 0;
      var toWord = 0;

      while (fromWord < words.length) {
        var lineElement = document.createElement('div');
        lineElement.classList.add('line');
        lineContainer.append(lineElement);
        var sizeFactor = 1; // Add words until the line's height becomes smaller than the minimum

        do {
          toWord += 1;
          lineElement.textContent = words.slice(fromWord, toWord).join(' ');
          sizeFactor = container.clientWidth / lineElement.clientWidth;
        } while (toWord <= words.length && lineElement.clientHeight * sizeFactor / container.clientHeight >= minLineHeight); // If we exited the loop because the height became less than the minimum


        if (toWord <= words.length) {
          // If possible remove one word to go back above the minimum
          if (toWord > fromWord + 1) {
            toWord -= 1;
          }
        }

        lineElement.textContent = words.slice(fromWord, toWord).join(' ');

        if (smallText) {
          // Make the line the minimum height unless it doesn't fit and it needs shrinking
          // (this happens with single words that are very long)
          sizeFactor = Math.min(container.clientWidth / lineElement.clientWidth, minLineHeight * container.clientHeight / lineElement.clientHeight);
        } else {
          // Make the line the full width unless it goes over the max height and it needs
          // shrinking
          sizeFactor = Math.min(container.clientWidth / lineElement.clientWidth, maxLineHeight * container.clientHeight / lineElement.clientHeight);
        } // Center the line


        lineElement.style.left = "".concat((container.clientWidth - lineElement.clientWidth * sizeFactor) / 2, "px");
        lineElement.style.transform = "scale(".concat(sizeFactor, ")");
        lineElement.style.top = "".concat(lastHeight, "px");
        lastHeight += lineElement.clientHeight * sizeFactor + lineSpacing;
        fromWord = toWord;
      }
    }
  });
  lineContainer.style.top = "".concat((container.clientHeight - lastHeight) / 2, "px");
}

module.exports = {
  render: render
};

},{}]},{},[1])(1)
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var objectCreate = Object.create || objectCreatePolyfill
var objectKeys = Object.keys || objectKeysPolyfill
var bind = Function.prototype.bind || functionBindPolyfill

function EventEmitter() {
  if (!this._events || !Object.prototype.hasOwnProperty.call(this, '_events')) {
    this._events = objectCreate(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

var hasDefineProperty;
try {
  var o = {};
  if (Object.defineProperty) Object.defineProperty(o, 'x', { value: 0 });
  hasDefineProperty = o.x === 0;
} catch (err) { hasDefineProperty = false }
if (hasDefineProperty) {
  Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
    enumerable: true,
    get: function() {
      return defaultMaxListeners;
    },
    set: function(arg) {
      // check whether the input is a positive number (whose value is zero or
      // greater and not a NaN).
      if (typeof arg !== 'number' || arg < 0 || arg !== arg)
        throw new TypeError('"defaultMaxListeners" must be a positive number');
      defaultMaxListeners = arg;
    }
  });
} else {
  EventEmitter.defaultMaxListeners = defaultMaxListeners;
}

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || isNaN(n))
    throw new TypeError('"n" argument must be a positive number');
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

// These standalone emit* functions are used to optimize calling of event
// handlers for fast cases because emit() itself often has a variable number of
// arguments and can be deoptimized because of that. These functions always have
// the same number of arguments and thus do not get deoptimized, so the code
// inside them can execute faster.
function emitNone(handler, isFn, self) {
  if (isFn)
    handler.call(self);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self);
  }
}
function emitOne(handler, isFn, self, arg1) {
  if (isFn)
    handler.call(self, arg1);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1);
  }
}
function emitTwo(handler, isFn, self, arg1, arg2) {
  if (isFn)
    handler.call(self, arg1, arg2);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2);
  }
}
function emitThree(handler, isFn, self, arg1, arg2, arg3) {
  if (isFn)
    handler.call(self, arg1, arg2, arg3);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2, arg3);
  }
}

function emitMany(handler, isFn, self, args) {
  if (isFn)
    handler.apply(self, args);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].apply(self, args);
  }
}

EventEmitter.prototype.emit = function emit(type) {
  var er, handler, len, args, i, events;
  var doError = (type === 'error');

  events = this._events;
  if (events)
    doError = (doError && events.error == null);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    if (arguments.length > 1)
      er = arguments[1];
    if (er instanceof Error) {
      throw er; // Unhandled 'error' event
    } else {
      // At least give some kind of context to the user
      var err = new Error('Unhandled "error" event. (' + er + ')');
      err.context = er;
      throw err;
    }
    return false;
  }

  handler = events[type];

  if (!handler)
    return false;

  var isFn = typeof handler === 'function';
  len = arguments.length;
  switch (len) {
      // fast cases
    case 1:
      emitNone(handler, isFn, this);
      break;
    case 2:
      emitOne(handler, isFn, this, arguments[1]);
      break;
    case 3:
      emitTwo(handler, isFn, this, arguments[1], arguments[2]);
      break;
    case 4:
      emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
      break;
      // slower
    default:
      args = new Array(len - 1);
      for (i = 1; i < len; i++)
        args[i - 1] = arguments[i];
      emitMany(handler, isFn, this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');

  events = target._events;
  if (!events) {
    events = target._events = objectCreate(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener) {
      target.emit('newListener', type,
          listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (!existing) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
          prepend ? [listener, existing] : [existing, listener];
    } else {
      // If we've already got an array, just append.
      if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
    }

    // Check for listener leak
    if (!existing.warned) {
      m = $getMaxListeners(target);
      if (m && m > 0 && existing.length > m) {
        existing.warned = true;
        var w = new Error('Possible EventEmitter memory leak detected. ' +
            existing.length + ' "' + String(type) + '" listeners ' +
            'added. Use emitter.setMaxListeners() to ' +
            'increase limit.');
        w.name = 'MaxListenersExceededWarning';
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        if (typeof console === 'object' && console.warn) {
          console.warn('%s: %s', w.name, w.message);
        }
      }
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    switch (arguments.length) {
      case 0:
        return this.listener.call(this.target);
      case 1:
        return this.listener.call(this.target, arguments[0]);
      case 2:
        return this.listener.call(this.target, arguments[0], arguments[1]);
      case 3:
        return this.listener.call(this.target, arguments[0], arguments[1],
            arguments[2]);
      default:
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; ++i)
          args[i] = arguments[i];
        this.listener.apply(this.target, args);
    }
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = bind.call(onceWrapper, state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');

      events = this._events;
      if (!events)
        return this;

      list = events[type];
      if (!list)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = objectCreate(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else
          spliceOne(list, position);

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (!events)
        return this;

      // not listening for removeListener, no need to emit
      if (!events.removeListener) {
        if (arguments.length === 0) {
          this._events = objectCreate(null);
          this._eventsCount = 0;
        } else if (events[type]) {
          if (--this._eventsCount === 0)
            this._events = objectCreate(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = objectKeys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = objectCreate(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (!events)
    return [];

  var evlistener = events[type];
  if (!evlistener)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
};

// About 1.5x faster than the two-arg version of Array#splice().
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
    list[i] = list[k];
  list.pop();
}

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function objectCreatePolyfill(proto) {
  var F = function() {};
  F.prototype = proto;
  return new F;
}
function objectKeysPolyfill(obj) {
  var keys = [];
  for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k)) {
    keys.push(k);
  }
  return k;
}
function functionBindPolyfill(context) {
  var fn = this;
  return function () {
    return fn.apply(context, arguments);
  };
}

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _events = _interopRequireDefault(require("events"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Interface that creates an announcer inside an iframe.
 */
var AnnouncerFrame =
/*#__PURE__*/
function () {
  function AnnouncerFrame() {
    _classCallCheck(this, AnnouncerFrame);

    this.busy = false;
    this.visible = false;
    this.wrapper = null;
    this.iframe = null;
    this.hideTimeout = null;
    this.events = new _events["default"]();
  }
  /**
   * Show an announcement.
   *
   * This method creates an iframe attached to the current page's body.
   * The frame will be removed when the announcement ends its duration
   * or it's manually hidden.
   *
   * This method will fail (with a rejection) if an announcement is already
   * in progress.
   *
   * @param {string} announcerSrc
   *  URL of the index.html file of content-slider-announcer
   * @param {string} text
   *  Text to display
   * @param {object} options
   *  Options (see README)
   * @return Promise
   *  Returns a promise that resolves when the announcement is closed
   */


  _createClass(AnnouncerFrame, [{
    key: "show",
    value: function show(announcerSrc, text) {
      var _this = this;

      var userOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return new Promise(function (resolve, reject) {
        if (_this.busy || _this.visible) {
          reject(new Error('Announcement already in progress.'));
        }

        _this.busy = true;
        var defaultOptions = {
          duration: 60000
        };
        var options = Object.assign({}, defaultOptions, userOptions);
        _this.visible = true;
        _this.wrapper = window.document.createElement('div');

        _this.wrapper.classList.add('content-slider-announcer-wrapper');

        _this.iframe = window.document.createElement('iframe');

        _this.iframe.setAttribute('src', announcerSrc);

        _this.iframe.setAttribute('allowtransparency', 'true');

        _this.iframe.addEventListener('load', function () {
          _this.iframe.contentWindow.postMessage({
            type: 'announce',
            text: text,
            options: userOptions
          });
        });

        var eventMask = window.document.createElement('div');
        eventMask.classList.add('content-slider-announcer-eventMask');
        eventMask.addEventListener('pointerdown', function () {
          _this.hide();
        });

        _this.wrapper.append(_this.iframe);

        _this.wrapper.append(eventMask);

        window.document.querySelector('body').append(_this.wrapper);
        _this.hideTimeout = setTimeout(function () {
          _this.hide();

          _this.clearTimeoutTimer();
        }, options.duration);

        _this.events.once('close', function () {
          resolve();
        });

        _this.busy = false;
      });
    }
    /**
     * Hide the current announcement with a fade out animation.
     */

  }, {
    key: "hide",
    value: function hide() {
      var _this2 = this;

      if (this.busy || !this.visible) {
        return;
      }

      this.busy = true;
      this.iframe.contentWindow.postMessage({
        type: 'hide',
        duration: AnnouncerFrame.HIDE_DELAY
      });
      setTimeout(function () {
        _this2.destroyFrame();

        _this2.busy = false;
      }, AnnouncerFrame.HIDE_DELAY);
    }
    /**
     * Hide the current announcement immediately.
     */

  }, {
    key: "hideNow",
    value: function hideNow() {
      if (this.busy || !this.visible) {
        return;
      }

      this.busy = true;
      this.destroyFrame();
      this.busy = false;
    }
    /**
     * Destroy the iframe and perform cleanup
     */

  }, {
    key: "destroyFrame",
    value: function destroyFrame() {
      this.clearTimeoutTimer();
      this.wrapper.remove();
      this.wrapper = null;
      this.iframe = null;
      this.visible = false;
      this.events.emit('close');
    }
    /**
     * Clear and null the timeout timer
     */

  }, {
    key: "clearTimeoutTimer",
    value: function clearTimeoutTimer() {
      if (this.hideTimeout !== null) {
        clearTimeout(this.hideTimeout);
        this.hideTimeout = null;
      }
    }
  }]);

  return AnnouncerFrame;
}();

exports["default"] = AnnouncerFrame;
AnnouncerFrame.HIDE_DELAY = 2000;

},{"events":3}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _durden = _interopRequireDefault(require("@imaginary-maths/durden"));

var _textPoster = _interopRequireDefault(require("@imaginary-maths/text-poster"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Announcer =
/*#__PURE__*/
function () {
  function Announcer() {
    _classCallCheck(this, Announcer);

    this.container = window.document.createElement('div');
    this.container.classList.add('content-slider-announcement');
    window.document.querySelector('body').append(this.container);
    this.bgContainer = window.document.createElement('div');
    this.bgContainer.classList.add('content-slider-announcement-bg');
    this.container.append(this.bgContainer);
    this.txtContainer = window.document.createElement('div');
    this.txtContainer.classList.add('content-slider-announcement-txt');
    this.container.append(this.txtContainer);
    this.tiler = null;
    this.runningTween = null;
  }

  _createClass(Announcer, [{
    key: "announce",
    value: function announce(text) {
      var _this = this;

      var userOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var defaultOptions = {
        tilesAcross: 8,
        tilesVertically: 20,
        startAngle: 150,
        endAngle: _durden["default"].MIN_ANGLE,
        fadeInDuration: 5000,
        transformLoopDuration: 30000,
        strokeWidth: 1,
        strokeColor: '#000000',
        themes: []
      };
      var options = Object.assign({}, defaultOptions, userOptions);
      this.tiler = new _durden["default"].Durden(this.bgContainer, options.tilesAcross, options.tilesVertically, options.startAngle);
      this.tiler.setStroke(options.strokeWidth, options.strokeColor); // Color randomly with a default in case selecting a theme fails
      // because it was overriden with something in the wrong format

      this.tiler.colorTilesPeriodic(Announcer.DEFAULT_COLORS);
      this.selectTheme(options);
      this.tiler.setTileVisibility(false);
      this.runningTween = this.tiler.showTilesRandom(options.fadeInDuration).onComplete(function () {
        _this.runningTween = _this.tiler.transformTilesAnimated(options.transformLoopDuration, options.startAngle, options.endAngle, true);

        _textPoster["default"].render(_this.txtContainer, text);

        setTimeout(function () {
          _this.txtContainer.classList.add('visible');
        }, 0);
      });
    }
  }, {
    key: "selectTheme",
    value: function selectTheme(options) {
      var themes = options.themes;

      if (themes.length > 0) {
        var themeName = themes[Math.floor(Math.random() * themes.length)];
        var theme = options["theme_".concat(themeName)];

        if (theme && theme.mode && theme.colors instanceof Array) {
          if (theme.mode === 'random-supertile') {
            this.tiler.colorSuperTilesRandom(theme.colors);
          } else if (theme.mode === 'periodic-supertile') {
            this.tiler.colorSuperTilesPeriodic(theme.colors);
          } else if (theme.mode === 'periodic') {
            this.tiler.colorTilesPeriodic(theme.colors);
          } else {
            this.tiler.colorTilesRandom(theme.colors);
          }
        }
      }
    }
  }, {
    key: "hide",
    value: function hide() {
      var duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 2000;

      if (this.runningTween != null) {
        this.runningTween.stop();
      }

      this.txtContainer.classList.remove('visible');
      this.runningTween = this.tiler.hideSuperTilesOrdered(duration);
    }
  }]);

  return Announcer;
}();

exports["default"] = Announcer;
Announcer.DEFAULT_COLORS = ['#BF1736', '#0D1440', '#1438A6', '#0E2773'];

},{"@imaginary-maths/durden":1,"@imaginary-maths/text-poster":2}],6:[function(require,module,exports){
"use strict";

var _announcer = _interopRequireDefault(require("./announcer"));

var _announcerFrame = _interopRequireDefault(require("./announcer-frame"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var announcerFrame = null;
/**
 * Show an announcement on screen
 *
 * @param {string} announcerSrc
 *  URL of the index.html file of content-slider-announcer
 * @param {string} text
 *  Text to display
 * @param {object} options
 *  Options (see README)
 * @return Promise
 *  Returns a promise that resolves when the announcement is closed
 */

function createAnnouncement(announcerSrc, text) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (announcerFrame === null) {
    announcerFrame = new _announcerFrame["default"]();
  }

  return announcerFrame.show(announcerSrc, text, options);
}
/**
 * Hide the announcement
 */


function hideAnnouncement() {
  if (announcerFrame !== null) {
    announcerFrame.hide();
  }
}
/**
 * Hide the announcement without animations / delay
 */


function hideAnnouncementNow() {
  if (announcerFrame !== null) {
    announcerFrame.hideNow();
  }
}
/**
 * Does initialization in the frame used to show the announcements
 *
 * This method is called within the framed index.html. It's not really
 * part of the public interface.
 */


function initFrame() {
  var announcer = new _announcer["default"]();
  window.addEventListener('message', function (event) {
    var type = event.data.type;

    if (type === 'announce') {
      var _event$data = event.data,
          text = _event$data.text,
          options = _event$data.options;
      announcer.announce(text, options);
    } else if (type === 'hide') {
      var duration = event.data.duration;
      announcer.hide(duration);
    }
  }, false);
}

module.exports = {
  initFrame: initFrame,
  createAnnouncement: createAnnouncement,
  hideAnnouncement: hideAnnouncement,
  hideAnnouncementNow: hideAnnouncementNow
};

},{"./announcer":5,"./announcer-frame":4}]},{},[6])(6)
});
