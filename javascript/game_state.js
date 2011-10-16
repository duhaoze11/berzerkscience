var main = require('main');
var player = require('player');
var enemy = require('enemy');
var assert = require('assert');
var map = require('map');
var gamejs = require('gamejs');
var projectile = require('projectile');
var effect = require('effect');
var item = require('item');
var font = require('font');
var audio_effect = require('audio_effect');
var gamescreen = require('gamescreen');

function GameState() {
}

GameState.prototype.Init = function(m, current_room, player) {
  this.map = m;
  this.current_room = current_room;
  this.player = player;
  this._save_where_player_entered = new gamejs.Rect(this.player.rect);

  this.player_projectiles = new Array();
  this.enemy_projectiles = new Array();
  this.ENEMY_PROJECTILES_LIMIT = 10;
  this.current_room.calculate_distances_from_start(-1);
  this.current_room.generate_robots();

  this.statistics = new Object();
  this.statistics.rooms_visited = new Array();
  this._add_visited_room(this.current_room.id());
  this.statistics._game_time = 0;
  this.statistics._robots_killed = 0;
  this.statistics._player_killed = 0;
  this.statistics._books_picked_up = 0;

  this.machine_state = gamescreen.GAMESTATE_SCREENS;
  this.machine_screen_id = 0;

  var max = -1;
  var index = 0;
  for (var i = 0; i < map.NUM_ROOMS; i++) {
    var r = this.map.get(i);
    if (r._distance_from_start > max) {
      max = r._distance_from_start;
      index = i;
    }
  }
  //window.console.log('unicorn in room ' + index);
  this.map.generate_items(item.ITEM_BOOK_FIREBALL, 3, undefined);
  this.map.generate_items(item.ITEM_BOOK_LIGHTNING, 3, undefined);
  this.map.generate_items(item.ITEM_UNICORN, 1, 0);//index);

  this.effects = new Array();
}

GameState.prototype.get_stats_as_array = function() {
  var strings = ['rooms visited:',
      'robots killed:',
      'deaths:',
      'books collected:',];
  var nums = [ this.statistics.rooms_visited.length,
      this.statistics._robots_killed,
      this.statistics._player_killed,
      this.statistics._books_picked_up ];
  var strs = new Array();
  for (var i = 0; i < nums.length; i++) {
    strs[i] = '' + nums[i];
    for (;strs[i].length + strings[i].length < 18; strs[i] = ' '+strs[i]);
  }
  return [[10, strings[0] + strs[0]],
          [17, 'game time:       ' + Math.round(this.statistics._game_time / 1000) + ' seconds'],
          [11, strings[1] + strs[1]],
          [12, strings[2] + strs[2]], 
          [13, strings[3] + strs[3]]];
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

  audio_effect.PlaySound(audio_effect.SCREEN_CHANGE);
  var room_id = this.map.get_neighbour(this.current_room.id(), exit);
  this._add_visited_room(room_id);
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
  this.effects = new Array();
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
  var player_killed = false;
  for (var i = 0; i < this.enemy_projectiles.length; i++) {
    var proj = this.enemy_projectiles[i];
    proj.update(ms);
    if (proj.outside()) {
    } else if (proj.collides(this.current_room._walls_to_draw)
               || proj.collides([this.player])) {
      var killed = proj.explode(this.current_room, false, true);
      if (killed == true) {
        player_killed = true;
      }
    } else {
      new_projectiles.push(proj);
    }
    proj.draw(display);
  }
  this.enemy_projectiles = new_projectiles;
  if (player_killed) {
    if (this.player.is_alive != true)  {
      return;
    }
    audio_effect.PlaySound(audio_effect.PLAYER_HIT);
    this.statistics._player_killed++;
    this.player.become_dead();
  }
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
  var text = 'room ' + this.current_room.id();
  if (this.player.weapon_type == projectile.WEAPON_NONE) {
    text += ', no weapon';
  } else {
    text += ', ' + get_weapon_name(this.player.weapon_type)
      + ' ' + this.player.weapon_level;
  }
  var surface = font.global_font.generate_surface(text);

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
    if (cur_item.type == item.ITEM_UNICORN &&
        cur_item.rect.collideRect(this.player.rect)) {
      this.machine_state = gamescreen.GAMESTATE_SCREENS;
      this.machine_screen_id = gamescreen.GAMESTATE_GAMEWIN;
      continue;
    }
    if (cur_item.rect.collideRect(this.player.rect)) {
      removed = i;
      if (cur_item.type == item.ITEM_BOOK_FIREBALL) {
        audio_effect.PlaySound(audio_effect.FIRE_BOOK_PICKED_UP);
        this.statistics._books_picked_up++;
      } else if (cur_item.type == item.ITEM_BOOK_LIGHTNING) {
        audio_effect.PlaySound(audio_effect.LIGHTNING_BOOK_PICKED_UP);
        this.statistics._books_picked_up++;
      }
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

GameState.prototype.update_effects = function(ms, display) {
  var new_effects = new Array();
  for (var i = 0; i < this.effects.length; i++) {
    var eff = this.effects[i];
    eff.update(ms);
    if (!eff.expired) {
      new_effects.push(eff);
    }
    eff.draw(display);
  }
  this.effects = new_effects;
}

GameState.prototype._add_visited_room = function(id) {
  var l = this.statistics.rooms_visited;
  for (var i = 0; i < l.length; i++) {
    if (l[i] == id) return;
  }
  l[l.length] = id;
}

exports.game_state = global_game_state;
