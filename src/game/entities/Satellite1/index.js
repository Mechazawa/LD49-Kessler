import Satellite from '../Satellite';
import { first } from '../../../utils';
import DebrisBig from './DebrisBig';
import DebrisSmall from './DebrisSmall';
import DebrisTiny from './DebrisTiny';
import textures
  from 'svg-to-png-loader?width=50&height=50&name=images/[name]-[width]x[height].png!@/assets/satellite-1.svg';

export default class Satellite2 extends Satellite {
  static texture = first(textures);

  static debris = [
    DebrisBig,
    DebrisSmall,
    DebrisTiny,
  ];

  speed = 0.04;

  fuel = 200;

  collisionRadius = 15;
}
