var gamejs = require('gamejs');
var drawing = require('gamejs/draw');
var sprite = require('gamejs/sprite');
var assert = require('assert');

var ITEM_WIDTH = 40;
var ITEM_HEIGHT = 40;

var ITEM_BOOK_FIREBALL = 1;
var ITEM_BOOK_LIGHTNING = 2;
var ITEM_UNICORN = 3;

gamejs.preload(['graphics/items/firebook.png',
                'graphics/items/lightningbook.png']);

// rect - rectangle with (left, top) specifying where to put item's top left corner
function Item(rect, type) {
  Item.superConstructor.apply(this, arguments);
  this.type = type;
  this.rect = new gamejs.Rect([rect.left, rect.top], [ITEM_WIDTH, ITEM_HEIGHT]);

  switch (type) {
    case ITEM_BOOK_FIREBALL:
      this.image = gamejs.image.load("graphics/items/firebook.png");
      break;
    case ITEM_BOOK_LIGHTNING:
      this.image = gamejs.image.load("graphics/items/lightningbook.png");
      break;
    default:
      assert.assert(false, "item type unsupported : " + type);
  }
}

gamejs.utils.objects.extend(Item, sprite.Sprite);

// TODO(zvold): pull up to the superclass
Item.prototype.collides = function(sprites) {
  for (var i = 0; i < sprites.length; i++) {
    if (this.rect.collideRect(sprites[i].rect)) {
      return true;
    }
  }
  return false;
}

exports.Item = Item;
exports.ITEM_WIDTH = ITEM_WIDTH;
exports.ITEM_HEIGHT = ITEM_HEIGHT;
exports.ITEM_BOOK_FIREBALL = ITEM_BOOK_FIREBALL;
exports.ITEM_BOOK_LIGHTNING = ITEM_BOOK_LIGHTNING;
exports.ITEM_UNICORN = ITEM_UNICORN;
