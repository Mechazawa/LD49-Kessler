import AbstractEntity from './AbstractEntity';
import game from '../index';
import textures from 'svg-to-png-loader?width=80&height=80&name=[name]-[width]x[height].png!@/assets/planet.svg';
import { degToRad, first } from '../../utils';

export default class Planet extends AbstractEntity {
  static texture = first(textures);

  constructor () {
    super();

    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.position.set(400, 300);

    game.stage.addChild(this.sprite);
  }

  destroy () {

  }

  tick (delta) {
    this.sprite.rotation += (degToRad(0.3) * delta) % degToRad(360);
  }
}
