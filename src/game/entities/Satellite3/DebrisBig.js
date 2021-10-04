import { first } from '../../../utils';
import Sat1DebrisBig from '../Satellite1/DebrisBig';

export default class DebrisBig extends Sat1DebrisBig {
  static price = 5;
  static texture = [
    first(require('svg-to-png-loader?width=20&height=20&name=images/[name]-[width]x[height].png!@/assets/satellite-debris-big-1.svg')),
  ]

  collisionRadius = 10;
}
