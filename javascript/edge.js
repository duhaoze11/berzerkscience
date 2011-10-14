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
  if (a.weight > b.weight) return -1;
  if (a.x < b.x) return -1;
  if (a.x > b.x) return 1;
  if (a.y < b.y) return -1;
  if (a.y > b.y) return 1;
  return 0;
}

Edge.prototype.build_mst = function(edges) {
  edges.sort(Edge.prototype.comparator);

  var comp = new Array();
  for (var i = 0; i < edges.length; i++) {
    comp[i] = i;
  }

  var getcomp = function(v) {
    if (comp[v] == v) return v;
    return comp[v] = getcomp(comp[v]);
  }

  var room_connections_cnt = 0;
  var room_connections = new Array();
  for (var i = 0; i < edges.length; i++) {
    var x = getcomp(edges[i].x);
    var y = getcomp(edges[i].y);
    if (x == y) continue;
    comp[x] = comp[y];
    room_connections[room_connections_cnt] = new pair.Pair(edges[i].x, edges[i].y);
    room_connections_cnt++;
  }

  return room_connections;
}

exports.Edge = Edge;
