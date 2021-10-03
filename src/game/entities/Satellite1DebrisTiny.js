import Debris from './Debris';
import { first } from '../../utils';

export default class Satellite1DebrisTiny extends Debris {
  static price = 1;
  static texture = [
    first(require('svg-to-png-loader?width=10&height=10&name=images/[name]-[width]x[height].png!@/assets/satellite-1-debris-tiny-1.svg')),
    first(require('svg-to-png-loader?width=10&height=10&name=images/[name]-[width]x[height].png!@/assets/satellite-1-debris-tiny-2.svg')),
  ]

  collisionRadius = 4;
}
