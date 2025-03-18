export function handlerOffsetDirection(handlerOffset, fixedDirection) {
  "worklet";

  if (fixedDirection === "negative") return -1;
  if (fixedDirection === "positive") return 1;
  if (handlerOffset.value === 0) return -1;
  return Math.sign(handlerOffset.value);
}
//# sourceMappingURL=handleroffset-direction.js.map