import EventEmitter from 'events';
import { Sprite } from 'pixi.js';
import game from '../index';

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

  constructor () {
    super();

    this.sprite = new Sprite(game.loader.resources[this.constructor.texture].texture);
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
   * @abstract
   */
  destroy () {
  }
}
