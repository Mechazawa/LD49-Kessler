import EventEmitter from 'events';

export default class Key extends EventEmitter {
  key;

  released = true;
  pressed = false;

  preventDefault = false;

  /**
   * @see {KeyboardEvent.key}
   * @param key {string}
   */
  constructor (key) {
    if (Key._instances.hasOwnProperty(key)) {
      Key._instances[key].count++;

      return Key._instances[key].instance;
    }

    super();

    Key._instances[key] = {
      count: 1,
      instance: this,
    };

    this.key = key;
    this._handleUp = this._handleUp.bind(this);
    this._handleDown = this._handleDown.bind(this);

    window.addEventListener('keyup', this._handleUp, false);
    window.addEventListener('keydown', this._handleDown, false);
  }

  destroy () {
    // todo fix or remove
    // const count = --Key._instances[this.key].count;
    //
    // if (count > 0) {
    //   return;
    // }
    //
    // window.removeEventListener('keyup', this._handleUp);
    // window.removeEventListener('keydown', this._handleDown);
  }

  _handleUp (event) {
    if (event.key !== this.key) {
      return;
    }

    this.released = true;
    this.pressed = false;

    this.emit('up', event);

    if (this.preventDefault) {
      event.preventDefault();
    }
  }


  _handleDown (event) {
    if (event.key !== this.key) {
      return;
    }

    this.released = false;
    this.pressed = true;

    this.emit('down', event);

    if (this.preventDefault) {
      event.preventDefault();
    }
  }

  /**
   *
   * @type {{count: number, instance: Key}}
   */
  static _instances = {};

  static getInstance (key) {
    if (Key._instances.hasOwnProperty(key)) {
      return Key._instances[key].instance;
    }

    return new Key(key);
  }
}
