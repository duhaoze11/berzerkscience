var gamejs = require('gamejs');
var drawing = require('gamejs/draw');
var utils = require('utils');

gamejs.preload(['graphics/walls/brick1.png',
                'graphics/walls/brick2.png',
                'graphics/walls/brick3.png',
                'graphics/walls/metall1.png',
                'graphics/walls/metall2.png',
                'graphics/walls/metall3.png']);

// type is poor man's enum
// 0 - small x small (small square wall)
// 1 - big x small (horizontal wall)
// 2 - small x big (vertical wall)
// 3 - big x big (big open room)
function Wall(type, rect) {
  Wall.superConstructor.apply(this, arguments);
  this._type = type;
  switch (this._type) {
    case 0:
      this.image = gamejs.image.load("graphics/walls/brick3.png");
      break;
    case 1:
      this.image = gamejs.image.load("graphics/walls/brick2.png");
      break;
    case 2:
      this.image = gamejs.image.load("graphics/walls/brick1.png");
      break;
    case 3:
      // not supported
      this.image = gamejs.image.load("graphics/walls/brick1.png");
      break;
    case 4:
      this.image = gamejs.image.load("graphics/walls/metall3.png");
      break;
    case 5:
      this.image = gamejs.image.load("graphics/walls/metall2.png");
      break;
    case 6:
      this.image = gamejs.image.load("graphics/walls/metall1.png");
      break;
    case 7:
      // not supported
      this.image = gamejs.image.load("graphics/walls/metall1.png");
      break;
  }
  this.rect = new gamejs.Rect(rect);
}

gamejs.utils.objects.extend(Wall, gamejs.sprite.Sprite);

exports.Wall = Wall;

