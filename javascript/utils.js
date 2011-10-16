var gamejs = require('gamejs');

exports.rand_int = function(n) {
  return Math.floor(Math.random() * n);
}

exports.check = function(r) {
  if (!(!isNaN(r.left) && !isNaN(r.top) && !isNaN(r.width) && !isNaN(r.height))) {
    throw "ZZ";
  }
}
