import Vue from 'vue';

export function first (obj) {
  if (obj instanceof Set) {
    obj = Array.from(obj);
  }

  return obj[0] ?? Object.values(obj)[0] ?? obj;
}

export function degToRad (deg) {
  return deg * degToRad.mul;
}

degToRad.mul = Math.PI / 180;

export function radToDeg (rad) {
  return rad / degToRad.mul;
}

export function unique (arr) {
  return Array.from(new Set(arr));
}

export function arrGen (fn, count) {
  const out = [];

  for (let i = 0; i < count; i++) {
    out.push(typeof fn === 'function' ? fn(i) : fn);
  }

  return out;
}

export function distance (a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

export function lineBBox (line) {
  const x = line.map(s => s.x);
  const y = line.map(s => s.y);

  return {
    minX: Math.min(...x),
    minY: Math.min(...y),
    maxX: Math.max(...x),
    maxY: Math.max(...y),
  };
}

//
// export function bboxIntersect (a, b) {
//   return !(
//     a.left > b.width ||
//     a.width < b.left ||
//     a.height < b.top ||
//     a.top > b.height
//   );
// }

export function circleIntersect (a, b) {
  const dist = (a.x - b.x) ** 2 + (a.y - b.y) ** 2;

  return (a.r - b.r) ** 2 <= dist && dist <= (a.r + b.r) ** 2;
}

export function randomPick (obj) {
  if (typeof obj !== 'object') {
    return obj;
  }

  const arr = Array.isArray(obj) ? obj : Array.from(Object.values(obj));

  return arr[Math.floor(Math.random() * arr.length)];
}

export function randInt (min, max) {
  return Math.random() * (max - min) + min;
}

export const env = Object.fromEntries((new URLSearchParams(location.hash.substr(1))).entries());

// Vue doesn't publicly export this constructor
const Observer = Object.getPrototypeOf(Vue.observable({}).__ob__).constructor;

export function blockObserver (obj) {
  if (obj && !obj.hasOwnProperty('__ob__')) {
    Object.defineProperty(obj, '__ob__', {
      value: new Observer({}),
      enumerable: false,
      configurable: false,
      writeable: false,
    });
  }

  return obj;
}

export function debug (...args) {
  if (env.hasOwnProperty('debug') && args.length) {
    console.log(...args);
  }

  return env.hasOwnProperty('debug');
}

debug('env', env);
