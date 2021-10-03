import { Application } from 'pixi.js';

export default new Application({
  width: 1000, // default: 800
  height: 750, // default: 600
  antialias: true, // default: false
  backgroundAlpha: 0, // default: 1
  resolution: 1, // default: 1, retina is future stuff (after mvp)
},);
