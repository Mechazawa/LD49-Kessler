export function first(obj) {
  return obj[0] ?? Object.values(obj)[0];
}

export function degToRad(deg) {
  return deg * degToRad.mul;
}

degToRad.mul = Math.PI / 180;

export function radToDeg(rad) {
  return rad / degToRad.mul;
}
