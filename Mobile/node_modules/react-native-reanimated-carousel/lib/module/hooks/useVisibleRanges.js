import { useRef } from "react";
import { useDerivedValue } from "react-native-reanimated";
export function useVisibleRanges(options) {
  const {
    total = 0,
    viewSize,
    translation,
    windowSize: _windowSize,
    loop
  } = options;
  const windowSize = _windowSize !== null && _windowSize !== void 0 ? _windowSize : total;
  const cachedRanges = useRef(null);
  const ranges = useDerivedValue(() => {
    var _cachedRanges$current, _cachedRanges$current2, _cachedRanges$current3, _cachedRanges$current4;

    const positiveCount = Math.round(windowSize / 2);
    const negativeCount = windowSize - positiveCount;
    let currentIndex = Math.round(-translation.value / viewSize);
    currentIndex = currentIndex < 0 ? currentIndex % total + total : currentIndex;
    let newRanges;

    if (!loop) {
      // Adjusting negative range if the carousel is not loopable.
      // So, It will be only displayed the positive items.
      newRanges = {
        negativeRange: [0 + currentIndex - (windowSize - 1), 0 + currentIndex],
        positiveRange: [0 + currentIndex, currentIndex + (windowSize - 1)]
      };
    } else {
      const negativeRange = [(currentIndex - negativeCount + total) % total, (currentIndex - 1 + total) % total];
      const positiveRange = [(currentIndex + total) % total, (currentIndex + positiveCount + total) % total];

      if (negativeRange[0] < total && negativeRange[0] > negativeRange[1]) {
        negativeRange[1] = total - 1;
        positiveRange[0] = 0;
      }

      if (positiveRange[0] > positiveRange[1]) {
        negativeRange[1] = total - 1;
        positiveRange[0] = 0;
      } // console.log({ negativeRange, positiveRange ,total,windowSize,a:total <= _windowSize})


      newRanges = {
        negativeRange,
        positiveRange
      };
    }

    if (isArraysEqual((_cachedRanges$current = (_cachedRanges$current2 = cachedRanges.current) === null || _cachedRanges$current2 === void 0 ? void 0 : _cachedRanges$current2.negativeRange) !== null && _cachedRanges$current !== void 0 ? _cachedRanges$current : [], newRanges.negativeRange) && isArraysEqual((_cachedRanges$current3 = (_cachedRanges$current4 = cachedRanges.current) === null || _cachedRanges$current4 === void 0 ? void 0 : _cachedRanges$current4.positiveRange) !== null && _cachedRanges$current3 !== void 0 ? _cachedRanges$current3 : [], newRanges.positiveRange)) return cachedRanges.current;
    cachedRanges.current = newRanges;
    return cachedRanges.current;
  }, [loop, total, windowSize, translation]);
  return ranges;
}

function isArraysEqual(a, b) {
  "worklet";

  if (a.length !== b.length) return false;
  return a.every((value, index) => value === b[index]);
}
//# sourceMappingURL=useVisibleRanges.js.map