import Satellite from '../Satellite';
import { first } from '../../../utils';
import DebrisBig from './DebrisBig';
import DebrisSmall from './DebrisSmall';
import textures
  from 'svg-to-png-loader?width=36&height=30&name=images/[name]-[width]x[height].png!@/assets/satellite-sputnik.svg';

export default class Sputnik extends Satellite {
  static texture = first(textures);

  static debris = [
    DebrisBig,
    DebrisSmall,
  ];

  speed = 0.005;

  fuel = 100;

  collisionRadius = 18;

  constructor (...args) {
    super(...args);

    this.sprite.anchor.set(0.25, 0.25);
  }
}
