var gamejs = require('gamejs');

function Pair(x,y) {
  this.x = x;
  this.y = y;
  this.toString = function() {
    return '(' + this.x + ',' + this.y + ')';
  }
}

exports.Pair = Pair;
