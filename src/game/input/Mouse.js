import EventEmitter from 'events';

const instanceSymbol = Symbol('instance');

/**
 * @singleton
 */
export default class Mouse extends EventEmitter {
  /**
   * @type {Mouse}
   * @private
   */
  [instanceSymbol];

  x;
  y;
  buttons = [false, false, false, false, false];

  constructor () {
    if (Mouse[instanceSymbol]) {
      return Mouse[instanceSymbol];
    }

    super();

    Mouse[instanceSymbol] = this;

    const el = document.getElementsByTagName('canvas')[0];

    el.addEventListener('mousemove', e => this._update(e));
    el.addEventListener('mouseup', e => this._update(e));
    el.addEventListener('mousedown', e => this._update(e));
  }

  /**
   * Called on mouse event
   * @param e {MouseEvent}
   * @private
   */
  _update (e) {
    // todo cache?
    const rect = e.target.getBoundingClientRect();

    this.x = e.x - rect.left;
    this.y = e.y - rect.top;
    this.buttons = [1, 2, 4, 8, 16].map(x => (e.buttons & x) > 0);
  }

  /**
   * Get instance
   * @returns {Mouse}
   */
  static getInstance () {
    return new Mouse();
  }
}
