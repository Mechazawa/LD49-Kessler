import EventEmitter from 'events';
import RBush from 'rbush';

class EntityStore extends EventEmitter {
  store = new Map();
  _flatStore = new Set();

  tree = new RBush(9);

  add (entity) {
    for (const constructor of EntityStore._getConstructorsFor(entity)) {
      if (!this.store.has(constructor)) {
        this.store.set(constructor, new Set());
      }

      this.store.get(constructor).add(entity);
    }

    this._flatStore.add(entity);
  }

  remove (entity) {
    for (const constructor of EntityStore._getConstructorsFor(entity)) {
      if (this.store.has(constructor)) {
        this.store.get(constructor).delete(entity);
      }
    }

    this._flatStore.delete(entity);
  }

  forEach (fn, type = null) {
    if (type) {
      for (const entity of this.store.get(type)) {
        fn(entity);
      }
    } else {
      for (const entity of this._flatStore) {
        fn(entity);
      }
    }
  }

  tick (delta) {
    this.forEach(entity => {
      if (!entity.dead) {
        entity.tick(delta);
      }

      if (entity.dead) {
        entity.destroy();
        this.remove(entity);
      }
    });
  }

  update (delta) {
    this.forEach(entity => !entity.dead && entity.update(delta));
  }

  getEntitiesForType (...types) {
    return new Set(types.map(t => this.store.get(t) ?? []).map(s => Array.from(s)).flat());
  }

  static _getConstructorsFor (item) {
    const output = [item.constructor];
    let last = Object.getPrototypeOf(item);

    do {
      output.push(last.constructor);
      last = Object.getPrototypeOf(last);
    } while (last?.constructor !== Object);

    return output;
  }
}

export default new EntityStore();
