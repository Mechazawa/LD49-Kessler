import AbstractEntity from './AbstractEntity';
import game from '../index';
import textures from 'svg-to-png-loader?width=50&height=50&name=[name]-[width]x[height].png!@/assets/satellite1.svg';
import { first } from '../../utils';
import entityStore from '../EntityStore';
import Planet from './Planet';
import * as PIXI from 'pixi.js';
import Trail from '../Trail';


export default class Satellite extends AbstractEntity {
  static texture = first(textures);

  constructor () {
    super();

    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.position.set(400, 500);

    this.sprite.vx = 1.2;
    this.sprite.vy = 0;

    game.stage.addChild(this.sprite);

    const trailTexture = game.loader.resources['images/trail.png'].texture;

    window.satellite = this;

    this.trail = new Trail(this, trailTexture, 30, 200);
    this.trail.rope.blendMode = PIXI.BLEND_MODES.ADD;
  }

  destroy () {

  }

  tick (delta) {
    const planet = Array.from(entityStore.getEntitiesForType(Planet))[0];
    const scale = 10_000;

    const rx = this.sprite.x - planet.sprite.x;
    const ry = this.sprite.y - planet.sprite.y;

    // todo remove need for "scale"
    const radius = Math.sqrt(rx ** 2 + ry ** 2) * scale;
    const gravAccel = planet.gravity * (planet.mass / radius ** 2);
    const angle = Math.atan2(rx, ry);

    this.sprite.vx += (Math.sin(angle) * gravAccel) / scale;
    this.sprite.vy += (Math.cos(angle) * gravAccel) / scale;

    this.sprite.rotation = -angle;

    this.trail.tick();
  }

  update (delta) {
    this.sprite.x -= this.sprite.vx;
    this.sprite.y -= this.sprite.vy;
  }
}
