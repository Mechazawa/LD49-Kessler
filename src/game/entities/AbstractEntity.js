import EventEmitter from 'events';
import { Sprite } from 'pixi.js';
import game from '../index';
import { blockObserver, randomPick } from '../../utils';

export default class AbstractEntity extends EventEmitter {
  /**
   * Sprite url or name
   * @type {string}
   * @abstract
   */
  static texture;

  /**
   * Sprite
   * @type {PIXI.Sprite}
   */
  sprite;

  dead = false;

  constructor () {
    super();

    if (this.constructor.texture) {
      this.sprite = blockObserver(new Sprite(game.loader.resources[randomPick(this.constructor.texture)].texture));
    }
  }

  /**
   * Called every tick
   * Used for updating state
   * @param delta {number}
   * @abstract
   */
  tick (delta) {
  }

  /**
   * Called every tick before draw
   * Update sprite state
   * @param delta {number}
   */
  update (delta) {
    if (!Number.isNaN(this.sprite.vx + this.sprite.vy)) {
      this.sprite.x += this.sprite.vx;
      this.sprite.y += this.sprite.vy;
    }
  }

  /**
   * Called upon destruction
   * Used for removing event listeners etc
   */
  destroy () {
    this.removeAllListeners();

    game.stage.removeChild(this.sprite);

    if (this.sprite._texture) {
      this.sprite.destroy();
    }

    this.dead = true;
  }
}
