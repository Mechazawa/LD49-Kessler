import AbstractEntity from './AbstractEntity';
import game from '../index';
import textures from 'svg-to-png-loader?width=55&height=46&name=images/[name]-[width]x[height].png!@/assets/collision-prediction.svg';
import { first } from '../../utils';

export default class Prediction extends AbstractEntity {
  static texture = first(textures);

  /**
   * @type {Orbital}
   */
  target;

  ttl = 0;

  constructor (target, x, y, ttl) {
    super();

    this.target = target;
    this.ttl = ttl;

    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.position.set(x, y);
    this.sprite.scale.x = (target.collisionRadius + 50) / 100;
    this.sprite.scale.y = (target.collisionRadius + 50) / 100;

    game.stage.addChild(this.sprite);
  }

  tick (delta) {
    this.dead |= --this.ttl <= 0 || this.target.dead;
  }

  update (delta) {
    super.update(delta);
  }
}
