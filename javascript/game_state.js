var main = require('main');
var player = require('player');
var enemy = require('enemy');
var assert = require('assert');
var map = require('map');
var gamejs = require('gamejs');
var projectile = require('projectile');

function GameState() {
}

GameState.prototype.Init = function(map, current_room, player) {
  this.map = map;
  this.current_room = current_room;
  this.player = player;
  this._save_where_player_entered = new gamejs.Rect(this.player.rect);

  this.player_projectiles = new Array();
  this.enemy_projectiles = new Array();
  this.ENEMY_PROJECTILES_LIMIT = 10;
  this.current_room.calculate_distances_from_start(-1);
  this.current_room.generate_robots();
}

GameState.prototype.changeRoomIfNeeded = function() {
  var exit;
  if (this.player.rect.left > main.SCREEN_WIDTH - player.PLAYER_WIDTH) {
    exit = map.MAP_RIGHT;
  } else if (this.player.rect.left < 0) {
    exit = map.MAP_LEFT;
  } else if (this.player.rect.top > main.SCREEN_HEIGHT - player.PLAYER_HEIGHT) {
    exit = map.MAP_DOWN;
  }  else if (this.player.rect.top < 0) {
    exit = map.MAP_UP;
  }
  if (exit == undefined) {
    return;
  }

  var room_id = this.map.get_neighbour(this.current_room.id(), exit);
  assert.assert(room_id != -1, "exit detected incorrectly");
  this.current_room = this.map.get(room_id);
  switch (exit) {
    case map.MAP_LEFT:
      this.player.rect.left = main.SCREEN_WIDTH - player.PLAYER_WIDTH;
      break;
    case map.MAP_RIGHT:
      this.player.rect.left = 0;
      break;
    case map.MAP_UP:
      this.player.rect.top = main.SCREEN_HEIGHT - player.PLAYER_HEIGHT;
      break;
    case map.MAP_DOWN:
      this.player.rect.top = 0;
      break;
  }

  this.current_room.generate_robots();
  this._save_where_player_entered = new gamejs.Rect(this.player.rect);

  // delete all player's projectiles as we changed room
  this.player_projectiles = new Array();
  this.player.num_projectiles = 0;
  this.enemy_projectiles = new Array();
}

GameState.prototype.reinit_room = function() {
  this.player.rect = new gamejs.Rect(this._save_where_player_entered);
  this.current_room.generate_robots();
  this.player_projectiles = new Array();
  this.player.num_projectiles = 0;
  this.enemy_projectiles = new Array();
}

GameState.prototype.current_room_id = function() {
  return this.current_room.id();
}

var global_game_state = new GameState();

GameState.prototype.add_player_projectile = function(proj) {
  this.player_projectiles.push(proj);
}

GameState.prototype.add_enemy_projectile = function(proj) {
  this.enemy_projectiles.push(proj);
}

GameState.prototype.update_player_projectiles = function(ms, display) {
  var new_projectiles = new Array();
  for (var i = 0; i < this.player_projectiles.length; i++) {
    var proj = this.player_projectiles[i];
    proj.update(ms);
    if (proj.outside()) {
      this.player.num_projectiles--;
    } else if (proj.collides(this.current_room._walls_to_draw)
               || proj.collides(this.current_room._robots)) {
      proj.explode(this.current_room, true, false);
      this.player.num_projectiles--;
    } else {
      new_projectiles.push(proj);
    }
    proj.draw(display);
  }
  this.player_projectiles = new_projectiles;
  assert.assert(this.player.num_projectiles == this.player_projectiles.length, "projectiles limit");
}

GameState.prototype.update_enemy_projectiles = function(ms, display) {
  var new_projectiles = new Array();
  for (var i = 0; i < this.enemy_projectiles.length; i++) {
    var proj = this.enemy_projectiles[i];
    proj.update(ms);
    if (proj.outside()) {
    } else if (proj.collides(this.current_room._walls_to_draw)
               || proj.collides([this.player])) {
      proj.explode(this.current_room, false, true);
      if (this.enemy_projectiles.length == 0) {
        this.enemy_projectiles = new Array();
        return;
      }
    } else {
      new_projectiles.push(proj);
    }
    proj.draw(display);
  }
  this.enemy_projectiles = new_projectiles;
}

function get_weapon_name(type) {
  switch (type) {
    case projectile.WEAPON_FIREBALL:
      return 'fireball';
    case projectile.WEAPON_LIGHTNING:
      return 'lightning';
    default:
      return 'none';
  }
}

GameState.prototype.render_game_stats = function(display) {
  var surface_letters = (new gamejs.font.Font('20px Arial')).render(
      'room ' + this.current_room.id()
      + ', weapon: ' + get_weapon_name(this.player.weapon_type)
      + ' ' + this.player.weapon_level);
  var surface = new gamejs.Surface(surface_letters.rect);
  surface.fill('#ffffff');
  surface.blit(surface_letters);
  surface.setAlpha(0.4);
  display.blit(surface, [(main.SCREEN_WIDTH - surface.rect.width) / 2, 0]);
}

GameState.prototype.update_player_powerups = function() {
  if (this.current_room.items.length == 0) {
    return;
  }
  var removed;
  for (var i = 0; i < this.current_room.items.length; i++) {
    var cur_item = this.current_room.items[i];
    if (cur_item.rect.collideRect(this.player.rect)) {
      removed = i;
      if (this.player.weapon_type != cur_item.type) {
        this.player.weapon_level = 1;
      } else {
        if (this.player.weapon_level == projectile.MAX_WEAPON_LEVEL) {
          return;
        }
        this.player.weapon_level++;
      }
      this.player.weapon_type = cur_item.type;
    }
  }

  // TODO(zvold): refactor this item removal to be not so WTF
  if (removed != undefined) {
    var new_items = new Array();
    for (var i = 0; i < this.current_room.items.length; i++) {
      if (i != removed) {
        new_items.push(this.current_room.items[i]);
      }
    }
    this.current_room.items = new_items;
  }
}

exports.game_state = global_game_state;
