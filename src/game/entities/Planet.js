import AbstractEntity from './AbstractEntity';
import game from '../index';
import textures from 'svg-to-png-loader?width=80&height=80&name=images/[name]-[width]x[height].png!@/assets/planet.svg';
import { degToRad, first } from '../../utils';

export default class Planet extends AbstractEntity {
  static texture = first(textures);

  collisionRadius = 40;

  mass = 5.975e24;
  gravity = 6.6742e-11;

  constructor (x, y) {
    super();

    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.position.set(x, y);

    game.stage.addChild(this.sprite);
  }

  destroy () {

  }

  tick (delta) {
    this.sprite.rotation += (degToRad(0.2) * delta) % degToRad(360);
  }
}
