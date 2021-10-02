import AbstractEntity from './AbstractEntity';
import game from '../index';
import textures from 'svg-to-png-loader?width=50&height=50&name=[name]-[width]x[height].png!@/assets/satellite1.svg';
import { arrGen, circleIntersect, first, lineBBox } from '../../utils';
import entityStore from '../EntityStore';
import Planet from './Planet';
import * as PIXI from 'pixi.js';
import Trail from '../Trail';
import CollisionWarning from './CollisionWarning';


export default class Satellite extends AbstractEntity {
  static texture = first(textures);

  static collisionRadius = 20;

  lookahead = arrGen(() => new PIXI.Point(0, 0), 300);
  lookaheadIndex = 0;
  lookaheadBBox;
  lookaheadUpdateThreshold;
  lookaheadRope;

  constructor (x, y, vx, vy) {
    super();

    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.position.set(x, y);

    this.sprite.vx = vx;
    this.sprite.vy = vy;

    game.stage.addChild(this.sprite);

    const trailTexture = game.loader.resources['images/trail.png'].texture;

    window.satellite = this;

    this.trail = new Trail(this, trailTexture, 30, 200);
    this.trail.rope.blendMode = PIXI.BLEND_MODES.ADD;

    this.lookaheadUpdateThreshold = Math.floor(this.lookahead.length * 0.1);
    this.updateLookaheadSegments();

    this.lookaheadRope = new PIXI.SimpleRope(trailTexture, this.lookahead);
    game.stage.addChild(this.lookaheadRope);
  }

  destroy () {
    super.destroy();
  }

  tick (delta) {
    const planet = Array.from(entityStore.getEntitiesForType(Planet))[0];
    const { angle, vx, vy } = this.constructor.calcOrbitalVelocity(
      planet,
      this.sprite.x, this.sprite.y,
      this.sprite.vx, this.sprite.vy,
    );

    this.sprite.vx = vx;
    this.sprite.vy = vy;
    this.sprite.rotation = -angle;

    this.trail.tick();

    this.lookaheadIndex++;

    if (this.lookaheadIndex > this.lookaheadUpdateThreshold) {
      this.updateLookaheadSegments();
      this.updateCollisionLookahead();
    }
  }

  update (delta) {
    this.sprite.x -= this.sprite.vx;
    this.sprite.y -= this.sprite.vy;
  }

  updateLookaheadSegments () {
    const planet = Array.from(entityStore.getEntitiesForType(Planet))[0];

    let last = {
      x: this.sprite.x,
      y: this.sprite.y,
      vx: this.sprite.vx,
      vy: this.sprite.vy,
    };

    for (let i = 0; i < this.lookahead.length; i++) {
      const { x, y } = last;

      last = this.constructor.calcOrbitalVelocity(planet, last.x, last.y, last.vx, last.vy);

      last.x = x - last.vx;
      last.y = y - last.vy;

      this.lookahead[i].set(last.x, last.y);
    }

    this.lookaheadIndex = 0;
  }

  updateCollisionLookahead () {
    const tree = entityStore.tree;

    tree.remove(this.lookaheadBBox);
    this.lookaheadBBox = { ...lineBBox(this.lookahead), ref: this };

    for (const { ref } of tree.search(this.lookaheadBBox)) {
      const intersection = this.testCollision(ref);

      if (!intersection) continue;

      console.log('Intersection found!', intersection);

      if (!CollisionWarning.findForCollision(intersection, [this, ref])) {
        entityStore.add(new CollisionWarning(
          [this, ref],
          intersection.ap.x,
          intersection.ap.y,
          intersection.ttl,
        ));
      }
    }

    tree.insert(this.lookaheadBBox);
  }

  testCollision (target) {
    let ai = this.lookaheadIndex;
    let bi = target.lookaheadIndex;
    let ticker = false;

    while (ai < this.lookahead.length && bi < target.lookahead.length) {
      const ap = { ...this.lookahead[ai], r: this.constructor.collisionRadius };
      const bp = { ...target.lookahead[bi], r: target.constructor.collisionRadius };

      if (circleIntersect(ap, bp)) {
        return {
          ap,
          bp,
          ai,
          bi,
          ttl: Math.min(ai - this.lookaheadIndex, bi - target.lookaheadIndex),
        };
      }

      if (ticker) {
        ai++;
      } else {
        bi++;
      }

      ticker = !ticker;
    }

    return null;
  }

  static calcOrbitalVelocity (planet, x, y, vx, vy) {
    const scale = 10_000;

    const rx = x - planet.sprite.x;
    const ry = y - planet.sprite.y;

    // todo remove need for "scale"
    const radius = Math.sqrt(rx ** 2 + ry ** 2) * scale;
    const gravAccel = planet.gravity * (planet.mass / radius ** 2);
    const angle = Math.atan2(rx, ry);

    return {
      vx: vx + (Math.sin(angle) * gravAccel) / scale,
      vy: vy + (Math.cos(angle) * gravAccel) / scale,
      radius,
      angle,
      gravAccel,
    };
  }
}
