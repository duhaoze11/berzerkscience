var gamejs = require('gamejs');
var projectile = require('projectile');
var assert = require('assert');
var drawing = require('gamejs/draw');
var game_state = require('game_state');
var vectors = require('gamejs/utils/vectors');
var main = require('main');
var unit = require('unit');
var astar = require('gamejs/pathfinding/astar');
var room = require('room');

var ENEMY_WIDTH = exports.ENEMY_WIDTH = 40;
var ENEMY_HEIGHT = exports.ENEMY_HEIGHT = 40;

var orange_robot_image = 'graphics/robots/orange.png';
var red_robot_image = 'graphics/robots/red.png';
var yellow_robot_image = 'graphics/robots/yellow.png';
var tractor1_robot_image = 'graphics/robots/tractor1.png';
var tractor2_robot_image = 'graphics/robots/tractor2.png';
var robot_images = [ orange_robot_image, red_robot_image, yellow_robot_image, tractor1_robot_image, tractor2_robot_image ];

gamejs.preload(robot_images);

function Enemy(type, rect) {
  Enemy.superConstructor.apply(this, arguments);
  this._type = type;
  assert.assert(this._type >= 0 && this._type < robot_images.length, "Incorrect robot type");
  this.image = gamejs.image.load(robot_images[this._type]);
  this.rect = rect;
  this._going_to = [this.rect.left, this.rect.top];
  this._speed = 0.02+0.01*type;
  this.state = Enemy.StateEnum.ALIVE;
  this.time_from_last_shot = 1e6;
  this.fire_rate = 500;
}

gamejs.utils.objects.extend(Enemy, unit.Unit);

Enemy.StateEnum = {
  DEAD : 1,
  ALIVE : 2,
}

Enemy.prototype._select_astar_path = function() {
  var r = game_state.game_state.current_room;
  var who;
  var z = [this.rect.left,this.rect.top];
  var delta = 5;
  for (var i = 0; i < room.ROOM_HEIGHT; i++) {
    for (var j = 0; j < room.ROOM_WIDTH; j++) {
      if (r.get(i,j) == 1) continue;
      var x0 = room.get_edge(j);
      var y0 = room.get_edge(i);
      var dx = room.get_edge(j+1)-x0;
      var dy = room.get_edge(i+1)-y0;
      if (x0-delta <= z[0] && x0+dx+delta >= z[0] && y0-delta <= z[1] && y0+dy+delta >= z[1]) {
        who = [i,j];
      }
    }
  }
  if (who == undefined) { 
    return [this.rect.left,this.rect.top];
  }
  var dx = [0,1,0,-1];
  var dy = [1,0,-1,0];
  var to;
  for (var d = 0; d < 4; d++) {
    var aa = who[0]+dy[d];
    var bb = who[1]+dx[d];
    if (aa <= 0 || bb <= 0 || aa >= room.ROOM_HEIGHT-1 || bb >= room.ROOM_WIDTH-1) continue;
    if (r.get(aa,bb) == 1) continue;
    if (r._cell_map[aa][bb] < r._cell_map[who[0]][who[1]]) {
      to = [aa,bb];
    } else if (r._cell_map[aa][bb] > r._cell_map[who[0]][who[1]]) {
      continue;
    } else {
      to = [aa,bb];
    }
  }
  if (to == undefined) {
    return [this.rect.left,this.rect.top];
  }
  var x0 = room.get_edge(to[1]);
  var y0 = room.get_edge(to[0]);
  var dx = room.get_edge(to[1]+1)-x0;
  var dy = room.get_edge(to[0]+1)-y0;
  return [x0+dx*0.5,y0+dy*0.5];
}

Enemy.prototype._select_new_waypoint = function() {
  var p = game_state.game_state.player.rect;
  var line = [ [this.rect.left, this.rect.top], [p.left, p.top] ];
  var r = game_state.game_state.current_room;
  for (var i = 0; i < r._walls_to_draw.length; i++) {
    var z = r._walls_to_draw[i].rect;
    var tocheck = new gamejs.Rect(z.left-ENEMY_WIDTH,z.top-ENEMY_HEIGHT,z.width+ENEMY_WIDTH,z.height+ENEMY_HEIGHT);
    if (tocheck.collideLine(line[0], line[1])) {
      return this._select_astar_path();
    }
  }
  var dir = vectors.subtract([p.left, p.top], [this.rect.left, this.rect.top]);
  var len = vectors.len(dir);
  var eps = 1e-4;
  if (len > eps) {
    var dist_togo = vectors.truncate(len * 0.25);
    var dir_togo = vectors.multiply(vectors.unit(dir), dist_togo);
    return vectors.add([p.left, p.top], dir_togo);
  }
  return [this.rect.left, this.rect.top];
}

Enemy.prototype.update = function(ms) {
  this.time_from_last_shot += ms;
  var pos = [this.rect.left, this.rect.top];
  this._going_to = this._select_new_waypoint();
  var dir = vectors.subtract(this._going_to, pos);
  var len = vectors.len(dir);
  if (len > 1e-4) {
    var len_togo = this._speed * ms;
    var dir_togo = vectors.multiply(vectors.unit(dir), len_togo);
    this._make_sliding_move(dir_togo[0], dir_togo[1]);
  }
  if (this.time_from_last_shot > this.fire_rate) {
    var shoot_from = [ this.rect.left + this.rect.width*0.5, this.rect.top + this.rect.height*0.5 ];
  var p = game_state.game_state.player.rect;
    var shoot_to = [ p.left + p.width*0.5, p.top + p.height*0.5 ];
    if (!game_state.game_state.current_room.wall_collides_line(shoot_from, shoot_to)) {
      var proj = new projectile.Projectile(new gamejs.Rect(shoot_from[0], shoot_from[1]), vectors.subtract(shoot_to, shoot_from), projectile.WEAPON_ENEMY_BULLET, 1);
      this.time_from_last_shot = 0;
      game_state.game_state.add_enemy_projectile(proj);
    }
  }
}

Enemy.prototype.become_dead = function() {
  this.state = Enemy.StateEnum.DEAD;
}

exports.Enemy = Enemy;
exports.number_of_kinds = robot_images.length;
