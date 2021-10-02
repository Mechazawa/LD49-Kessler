import AbstractEntity from './AbstractEntity';
import game from '../index';
import { arrGen, circleIntersect, lineBBox } from '../../utils';
import entityStore from '../EntityStore';
import Planet from './Planet';
import * as PIXI from 'pixi.js';
import CollisionWarning from './CollisionWarning';


export default class Orbital extends AbstractEntity {
  collisionRadius = 0;

  lookahead = arrGen(() => new PIXI.Point(0, 0), 300);
  lookaheadIndex = 0;
  lookaheadBBox;
  lookaheadUpdateThreshold;

  constructor (x, y, vx, vy) {
    super();

    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.position.set(x, y);

    this.sprite.vx = vx;
    this.sprite.vy = vy;

    game.stage.addChild(this.sprite);

    this.lookaheadUpdateThreshold = Math.floor(this.lookahead.length * 0.1);
    this.updateLookaheadSegments();

    // game.stage.addChild(new PIXI.SimpleRope(trailTexture, this.lookahead));
  }

  destroy () {
    super.destroy();

    entityStore.tree.remove(this.lookaheadBBox);

    CollisionWarning.findForOrbital(this).forEach(x => x.destroy());
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

    if (this.lookaheadIndex > this.lookaheadUpdateThreshold) {
      this.updateLookaheadSegments();
      this.updateCollisionLookahead();
    }

    this.updateCollision();
  }

  update (delta) {
    this.sprite.x -= this.sprite.vx;
    this.sprite.y -= this.sprite.vy;
    this.lookaheadIndex++;
  }

  explode () {
    // todo explosion spawning
    this.destroy();
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

    CollisionWarning.findForOrbital(this).forEach(x => x.destroy());

    for (const { ref } of tree.search(this.lookaheadBBox)) {
      const intersection = this.testCollisionLookahead(ref);

      if (!intersection) continue;

      if (!CollisionWarning.findForCollision(intersection, [this, ref])) {
        entityStore.add(new CollisionWarning(
          CollisionWarning.findForOrbital(this).length ? [ref, this] : [this, ref],
          intersection.ap.x,
          intersection.ap.y,
          intersection.ttl,
        ));
      }
    }

    tree.insert(this.lookaheadBBox);
  }

  updateCollision () {
    // todo replace with "thing that orbits" class
    const collisions = Array.from(entityStore.getEntitiesForType(Orbital))
      .filter(e => !e.dead && this !== e && Boolean(this.testCollision(e)));

    if (collisions.length) {
      this.explode();

      collisions.forEach(e => e.explode());
    }
  }

  testCollision (target) {
    return circleIntersect({
      x: this.sprite.x, y: this.sprite.y, r: this.collisionRadius,
    }, {
      x: target.sprite.x, y: target.sprite.y, r: target.collisionRadius,
    });
  }

  testCollisionLookahead (target) {
    let ai = this.lookaheadIndex;
    let bi = target.lookaheadIndex;

    while (ai < this.lookahead.length && bi < target.lookahead.length) {
      const ap = { ...this.lookahead[ai], r: this.collisionRadius };
      const bp = { ...target.lookahead[bi], r: target.collisionRadius };

      if (circleIntersect(ap, bp)) {
        return {
          ap,
          bp,
          ai,
          bi,
          ttl: Math.min(ai - this.lookaheadIndex, bi - target.lookaheadIndex),
        };
      }

      ai++;
      bi++;
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
