import Debris from './Debris';
import { first } from '../../utils';

export default class Satellite1DebrisBig extends Debris {
  static price = 5;
  static texture = [
    first(require('svg-to-png-loader?width=20&height=20&name=images/[name]-[width]x[height].png!@/assets/satellite-1-debris-big-1.svg')),
    first(require('svg-to-png-loader?width=20&height=20&name=images/[name]-[width]x[height].png!@/assets/satellite-1-debris-big-2.svg')),
    first(require('svg-to-png-loader?width=20&height=20&name=images/[name]-[width]x[height].png!@/assets/satellite-1-debris-big-3.svg')),
  ]

  collisionRadius = 10;
}
