import Satellite from '../Satellite';
import { first } from '../../../utils';
import DebrisBig from './DebrisBig';
import DebrisSmall from './DebrisSmall';
import textures
  from 'svg-to-png-loader?width=66&height=25&name=images/[name]-[width]x[height].png!@/assets/satellite-sputnik.svg';

export default class Sputnik extends Satellite {
  static texture = first(textures);

  static debris = [
    DebrisBig,
    DebrisSmall,
  ];

  speed = 0.00;

  fuel = Infinity;

  collisionRadius = 18;
}
