import { Extrapolation, interpolate } from "react-native-reanimated";
export function parallaxLayout(baseConfig) {
  let modeConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const {
    size,
    vertical
  } = baseConfig;
  const {
    parallaxScrollingOffset = 100,
    parallaxScrollingScale = 0.8,
    parallaxAdjacentItemScale = parallaxScrollingScale ** 2
  } = modeConfig;
  return value => {
    "worklet";

    const translate = interpolate(value, [-1, 0, 1], [-size + parallaxScrollingOffset, 0, size - parallaxScrollingOffset]);
    const zIndex = Math.round(interpolate(value, [-1, 0, 1], [0, size, 0], Extrapolation.CLAMP));
    const scale = interpolate(value, [-1, 0, 1], [parallaxAdjacentItemScale, parallaxScrollingScale, parallaxAdjacentItemScale], Extrapolation.CLAMP);
    return {
      transform: [vertical ? {
        translateY: translate
      } : {
        translateX: translate
      }, {
        scale
      }],
      zIndex
    };
  };
}
//# sourceMappingURL=parallax.js.map