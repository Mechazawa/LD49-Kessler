import Orbital from './Orbital';
import textures from 'svg-to-png-loader?width=50&height=50&name=[name]-[width]x[height].png!@/assets/satellite1.svg';
import { first } from '../../utils';
import Trail from '../Trail';
import game from '../index';
import * as PIXI from 'pixi.js';

export default class Satellite extends Orbital {
  static texture = first(textures);

  static collisionRadius = 15;

  trail;

  constructor (x, y, vx, vy) {
    super(x, y, vx, vy);

    const trailTexture = game.loader.resources['images/trail.png'].texture;

    this.trail = new Trail(this, trailTexture, 20, 100);

    // game.stage.addChild(new PIXI.SimpleRope(trailTexture, this.lookahead));
  }

  tick (delta) {
    this.trail.tick();
    super.tick(delta);
  }

  destroy () {
    super.destroy();

    this.trail.destroy();
  }

  explode () {
    console.log('boom')

    super.explode();
  }
}
