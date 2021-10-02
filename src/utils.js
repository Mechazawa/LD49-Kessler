export function first (obj) {
  return obj[0] ?? Object.values(obj)[0];
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

export function arrGen(fn, count) {
  const out = [];

  for (let i = 0; i < count; i++) {
    out.push(typeof fn === 'function' ? fn(i) : fn);
  }

  return out;
}

