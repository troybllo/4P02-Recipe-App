/**
 * In worklet
 * e.g. runOnJS(lop)(...);
 */
export function log() {
  console.log(...arguments);
}
export function round(number) {
  "worklet";

  return Math.round(number);
}
//# sourceMappingURL=log.js.map