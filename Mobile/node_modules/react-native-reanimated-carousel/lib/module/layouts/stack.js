import { useMemo } from "react";
import { Dimensions } from "react-native";
import { Extrapolation, interpolate } from "react-native-reanimated";
const screen = Dimensions.get("window");
export function horizontalStackLayout() {
  let modeConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return _value => {
    "worklet";

    const {
      showLength,
      snapDirection = "left",
      moveSize = screen.width,
      stackInterval = 18,
      scaleInterval = 0.04,
      opacityInterval = 0.1,
      rotateZDeg = 30
    } = modeConfig;
    const {
      validLength,
      value,
      inputRange
    } = getCommonVariables({
      showLength: showLength,
      value: _value,
      snapDirection
    });
    const {
      zIndex,
      opacity
    } = getCommonStyles({
      validLength,
      value,
      opacityInterval,
      snapDirection
    });
    let translateX;
    let scale;
    let rotateZ;

    if (snapDirection === "left") {
      translateX = interpolate(value, inputRange, [-moveSize, 0, validLength * stackInterval], Extrapolation.CLAMP);
      scale = interpolate(value, inputRange, [1, 1, 1 - validLength * scaleInterval], Extrapolation.CLAMP);
      rotateZ = `${interpolate(value, inputRange, [-rotateZDeg, 0, 0], Extrapolation.CLAMP)}deg`;
    } else if (snapDirection === "right") {
      translateX = interpolate(value, inputRange, [-validLength * stackInterval, 0, moveSize], Extrapolation.CLAMP);
      scale = interpolate(value, inputRange, [1 - validLength * scaleInterval, 1, 1], Extrapolation.CLAMP);
      rotateZ = `${interpolate(value, inputRange, [0, 0, rotateZDeg], Extrapolation.CLAMP)}deg`;
    }

    const transform = [{
      translateX: translateX
    }, {
      scale: scale
    }, {
      rotateZ: rotateZ
    }];
    const styles = {
      transform,
      zIndex,
      opacity
    };
    return styles;
  };
}
export function useHorizontalStackLayout() {
  let customAnimationConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let customConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const config = useMemo(() => ({
    type: customAnimationConfig.snapDirection === "right" ? "negative" : "positive",
    viewCount: customAnimationConfig.showLength,
    ...customConfig
  }), [customAnimationConfig, customConfig]);
  return {
    layout: horizontalStackLayout(customAnimationConfig),
    config
  };
}
export function verticalStackLayout() {
  let modeConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return _value => {
    "worklet";

    const {
      showLength,
      snapDirection = "left",
      moveSize = screen.width,
      stackInterval = 18,
      scaleInterval = 0.04,
      opacityInterval = 0.1,
      rotateZDeg = 30
    } = modeConfig;
    const {
      validLength,
      value,
      inputRange
    } = getCommonVariables({
      showLength: showLength,
      value: _value,
      snapDirection
    });
    const {
      zIndex,
      opacity
    } = getCommonStyles({
      validLength,
      value,
      opacityInterval,
      snapDirection
    });
    let translateX;
    let scale;
    let rotateZ;
    let translateY;

    if (snapDirection === "left") {
      translateX = interpolate(value, inputRange, [-moveSize, 0, 0], Extrapolation.CLAMP);
      scale = interpolate(value, inputRange, [1, 1, 1 - validLength * scaleInterval], Extrapolation.CLAMP);
      rotateZ = `${interpolate(value, inputRange, [-rotateZDeg, 0, 0], Extrapolation.CLAMP)}deg`;
      translateY = interpolate(value, inputRange, [0, 0, validLength * stackInterval], Extrapolation.CLAMP);
    } else if (snapDirection === "right") {
      translateX = interpolate(value, inputRange, [0, 0, moveSize], Extrapolation.CLAMP);
      scale = interpolate(value, inputRange, [1 - validLength * scaleInterval, 1, 1], Extrapolation.CLAMP);
      rotateZ = `${interpolate(value, inputRange, [0, 0, rotateZDeg], Extrapolation.CLAMP)}deg`;
      translateY = interpolate(value, inputRange, [validLength * stackInterval, 0, 0], Extrapolation.CLAMP);
    }

    const transform = [{
      translateX: translateX
    }, {
      scale: scale
    }, {
      rotateZ: rotateZ
    }, {
      translateY: translateY
    }];
    const styles = {
      transform,
      zIndex,
      opacity
    };
    return styles;
  };
}

function getCommonVariables(opts) {
  "worklet";

  const {
    showLength,
    value: _value,
    snapDirection
  } = opts;

  function easeInOutCubic(v) {
    return v < 0.5 ? 4 * v * v * v : 1 - (-2 * v + 2) ** 3 / 2;
  }

  const page = Math.floor(Math.abs(_value));
  const diff = Math.abs(_value) % 1;
  const value = _value < 0 ? -(page + easeInOutCubic(diff)) : page + easeInOutCubic(diff);
  const validLength = showLength - 1;
  let inputRange;
  if (snapDirection === "left") inputRange = [-1, 0, validLength];else if (snapDirection === "right") inputRange = [-validLength, 0, 1];else throw new Error("snapDirection must be set to either left or right");
  return {
    inputRange,
    validLength,
    value
  };
}

function getCommonStyles(opts) {
  "worklet";

  const {
    snapDirection,
    validLength,
    value,
    opacityInterval
  } = opts;
  let zIndex;
  let opacity;

  if (snapDirection === "left") {
    zIndex = Math.floor(interpolate(value, [-1.5, -1, -1 + Number.MIN_VALUE, 0, validLength], [Number.MIN_VALUE, validLength, validLength, validLength - 1, -1]) * 10000) / 100;
    opacity = interpolate(value, [-1, 0, validLength - 1, validLength], [0.25, 1, 1 - (validLength - 1) * opacityInterval, 0.25]);
  } else if (snapDirection === "right") {
    zIndex = Math.floor(interpolate(value, [-validLength, 0, 1 - Number.MIN_VALUE, 1, 1.5], [1, validLength - 1, validLength, validLength, Number.MIN_VALUE]) * 10000) / 100;
    opacity = interpolate(value, [-validLength, 1 - validLength, 0, 1], [0.25, 1 - (validLength - 1) * opacityInterval, 1, 0.25]);
  } else {
    throw new Error("snapDirection must be set to either left or right");
  }

  return {
    zIndex: Math.round(zIndex),
    opacity
  };
}
//# sourceMappingURL=stack.js.map