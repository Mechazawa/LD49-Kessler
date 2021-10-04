import Satellite from '../Satellite';
import { first } from '../../../utils';
import DebrisBig from './DebrisBig';
import DebrisSmall from './DebrisSmall';
import DebrisTiny from './DebrisTiny';
import textures
  from 'svg-to-png-loader?width=36&height=38&name=images/[name]-[width]x[height].png!@/assets/satellite-3.svg';

export default class Satellite3 extends Satellite {
  static texture = first(textures);

  static debris = [
    DebrisBig,
    DebrisSmall,
    DebrisTiny,
  ];

  speed = 0.05;

  fuel = 200;

  collisionRadius = 18;
}
