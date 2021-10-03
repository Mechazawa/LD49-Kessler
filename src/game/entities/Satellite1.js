import Satellite from './Satellite';
import { first } from '../../utils';
import Satellite1DebrisBig from './Satellite1DebrisBig';
import Satellite1DebrisSmall from './Satellite1DebrisSmall';
import Satellite1DebrisTiny from './Satellite1DebrisTiny';
import textures
  from 'svg-to-png-loader?width=50&height=50&name=images/[name]-[width]x[height].png!@/assets/satellite-1.svg';

export default class Satellite1 extends Satellite {
  static texture = first(textures);

  speed = 0.05;

  fuel = 200;

  debris = [
    Satellite1DebrisBig,
    Satellite1DebrisSmall,
    Satellite1DebrisTiny,
  ];

  collisionRadius = 15;
}
