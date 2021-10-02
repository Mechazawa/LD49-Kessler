export function first (obj) {
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
