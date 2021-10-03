import AbstractEntity from './AbstractEntity';
import game from '../index';
import textures
  from 'svg-to-png-loader?width=1054&height=1054&name=images/[name]-[width]x[height].png!@/assets/escape-ring.svg';
import { degToRad, first } from '../../utils';

export default class EscapeRing extends AbstractEntity {
  static texture = first(textures);

  radius = Math.min(game.screen.width, game.screen.height) / 2 - 10;

  constructor () {
    super();

    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.position.set(game.screen.width / 2, game.screen.height / 2);

    this.sprite.width = this.radius * 2;
    this.sprite.height = this.radius * 2;

    this.sprite.alpha = 0.8;

    game.stage.addChildAt(this.sprite, 0);
  }
}
