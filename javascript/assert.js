function AssertException(message) { this.message = message; }
AssertException.prototype.toString = function () {
  return 'AssertException: ' + this.message;
}

function assert(exp, message) {
  if (!exp) {
    alert(message);
    throw new AssertException(message);
  }
}

exports.assert = assert;
