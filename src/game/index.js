import { Application } from 'pixi.js';

export default new Application({
  width: 800, // default: 800
  height: 600, // default: 600
  antialias: true, // default: false
  transparent: false, // default: false
  resolution: 1, // default: 1, retina is future stuff (after mvp)
},);
