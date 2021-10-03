import AbstractEntity from './AbstractEntity';
import game from '../index';
import { arrGen, circleIntersect, lineBBox } from '../../utils';
import entityStore from '../EntityStore';
import Planet from './Planet';
import * as PIXI from 'pixi.js';
import CollisionWarning from './CollisionWarning';
import Highlight from './Highlight';
import TrailPrediction from '../TrailPrediction';
import Explosion from './Explosion';
import SoundEffect from '../SoundEffect';


export default class Orbital extends AbstractEntity {
  static scale = 10_000;

  collisionRadius = 0;

  lookahead = arrGen(() => new PIXI.Point(0, 0), 300);
  lookaheadIndex = 0;
  lookaheadBBox;
  lookaheadUpdateThreshold;
  lookaheadPreview;

  selected = false;
  highlight;

  constructor (x, y, vx, vy) {
    super();

    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.position.set(x, y);

    this.sprite.vx = vx;
    this.sprite.vy = vy;

    this.sprite.interactive = true;
    this.sprite.buttonMode = true;

    this.sprite.on('pointerdown', e => this._onClick(e));

    game.stage.addChild(this.sprite);

    this.lookaheadUpdateThreshold = Math.floor(this.lookahead.length * 0.1);
    this.updateLookaheadSegments();

    // game.stage.addChild(new PIXI.SimpleRope(trailTexture, this.lookahead));
  }

  destroy () {
    super.destroy();

    this.deselect();

    entityStore.tree.remove(this.lookaheadBBox);

    CollisionWarning.findForOrbital(this).forEach(x => x.destroy());

    // todo maybe mope to explosion entity
    this.playDestroySound();
  }

  playDestroySound () {
    if(Math.random() > 0.7) {
      SoundEffect.explosion2().play();
    } else {
      SoundEffect.explosion().play();
    }
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
      const hadCollisionWarning = CollisionWarning.findForOrbital(this).some(x => x.satellites[0] === this);

      this.updateLookaheadSegments();
      this.updateCollisionLookahead();

      const hasCollisionWarning = CollisionWarning.findForOrbital(this).some(x => x.satellites[0] === this);

      if (!hadCollisionWarning && hasCollisionWarning) {
        SoundEffect.warning().play();
      }
    }

    this.updateCollision();

    this.lookaheadPreview?.tick(delta);
  }

  update (delta) {
    this.sprite.x -= this.sprite.vx;
    this.sprite.y -= this.sprite.vy;
    this.lookaheadIndex++;
  }

  explode () {
    entityStore.add(new Explosion(this.sprite.x, this.sprite.y));

    this.destroy();
  }

  _onClick (event) {
    if (this.selected) {
      this.deselect();

      return;
    }

    for (const entity of entityStore.getEntitiesForType(Orbital)) {
      if (entity !== this) {
        entity.deselect();
      }
    }

    this.selected = true;
    this.highlight = new Highlight(this);

    entityStore.add(this.highlight);

    this.lookaheadUpdateThreshold = 1;
    this.lookaheadPreview = new TrailPrediction(this);
  }

  deselect () {
    this.selected = false;

    this.highlight?.destroy();
    this.highlight = null;

    this.lookaheadUpdateThreshold = Math.floor(this.lookahead.length * 0.1);
    this.lookaheadPreview?.destroy();
    this.lookaheadPreview = null;
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

    CollisionWarning.findForOrbital(this).filter(x => x.satellites[0] === this).forEach(x => x.destroy());

    for (const { ref } of tree.search(this.lookaheadBBox)) {
      const intersection = this.testCollisionLookahead(ref);

      if (!intersection) continue;

      entityStore.add(new CollisionWarning(
        [this, ref],
        intersection.ap.x,
        intersection.ap.y,
        intersection.ttl,
      ));
    }

    const planets = Array.from(entityStore.getEntitiesForType(Planet));

    for (let i = this.lookaheadIndex; i < this.lookahead.length; i++) {
      const intersections = planets.filter(planet => circleIntersect({
        x: this.lookahead[i].x, y: this.lookahead[i].y, r: this.collisionRadius,
      }, {
        x: planet.sprite.x, y: planet.sprite.y, r: planet.collisionRadius,
      }));

      const ttl = this.lookaheadIndex - i;

      for (const planet of intersections) {
        if (!CollisionWarning.findForCollision({ ttl }, [this])) {
          entityStore.add(new CollisionWarning(
            [this],
            planet.sprite.x,
            planet.sprite.y,
            ttl,
          ));
        }
      }
    }

    tree.insert(this.lookaheadBBox);
  }

  updateCollision () {
    const collisions = Array.from(entityStore.getEntitiesForType(Orbital))
      .filter(e => !e.dead && this !== e && Boolean(this.testCollision(e)));

    if (collisions.length) {
      this.explode();

      collisions.forEach(e => e.explode());
    }

    const crashed = Array.from(entityStore.getEntitiesForType(Planet))
      .some(e => !e.dead && Boolean(this.testCollision(e)));

    if (crashed) {
      this.explode();
    }
  }

  testCollision (target) {
    return !this.dead && !target.dead && circleIntersect({
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
    const rx = x - planet.sprite.x;
    const ry = y - planet.sprite.y;

    // todo remove need for "scale"
    const radius = Math.sqrt(rx ** 2 + ry ** 2) * this.scale;
    const gravAccel = planet.gravity * (planet.mass / radius ** 2);
    const angle = Math.atan2(rx, ry);

    return {
      vx: vx + (Math.sin(angle) * gravAccel) / this.scale,
      vy: vy + (Math.cos(angle) * gravAccel) / this.scale,
      radius,
      angle,
      gravAccel,
    };
  }
}
