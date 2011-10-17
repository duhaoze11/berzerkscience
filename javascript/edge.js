var pair = require('pair');

function Edge(x, y) {
  this.x = x;
  this.y = y;
  this.weight = Math.random();
  this.toString = function() {
    return '' + this.x + ',' + this.y + ',' + this.weight;
  }
}

Edge.prototype.comparator = function(a,b) {
  if (a.weight < b.weight) return -1;
  if (a.weight > b.weight) return 1;
  if (a.x < b.x) return -1;
  if (a.x > b.x) return 1;
  if (a.y < b.y) return -1;
  if (a.y > b.y) return 1;
  return 0;
}

Edge.prototype._getcomp = function(v) {
  if (this._comp[v] == v) return v;
  return this._comp[v] = this._getcomp(this._comp[v]);
}

Edge.prototype.build_mst = function(edges) {
  var mx = -1;
  for (var i = 0; i < edges.length; i++) {
    var e = edges[i];
    if (e.x > mx) mx = e.x;
    if (e.y > mx) mx = e.y;
  }
  edges.sort(Edge.prototype.comparator);
  this._comp = new Array();
  for (var i = 0; i <= mx; i++) {
    this._comp[i] = i;
  }

  var room_connections_cnt = 0;
  var room_connections = new Array();
  for (var i = 0; i < edges.length; i++) {
    var e = edges[i];
    var x = this._getcomp(e.x);
    var y = this._getcomp(e.y);
    if (x == y) continue;
    this._comp[x] = this._comp[y];
    room_connections[room_connections_cnt] = new pair.Pair(e.x, e.y);
    room_connections_cnt++;
  }

  return room_connections;
}

exports.Edge = Edge;
