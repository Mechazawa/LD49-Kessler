import Debris from '../Debris';
import { first } from '../../../utils';

export default class DebrisSmall extends Debris {
  static price = 3;
  static texture = [
    first(require('svg-to-png-loader?width=20&height=10&name=images/[name]-[width]x[height].png!@/assets/satellite-sputnik-debris-small-1.svg')),
  ]

  collisionRadius = 7;
}
