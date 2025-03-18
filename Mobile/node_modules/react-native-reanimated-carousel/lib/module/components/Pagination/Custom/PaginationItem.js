import React from "react";
import { TouchableWithoutFeedback } from "react-native";
import Animated, { Extrapolation, interpolate, interpolateColor, useAnimatedStyle, runOnJS, useSharedValue, useDerivedValue } from "react-native-reanimated";
export const PaginationItem = props => {
  const defaultDotSize = 10;
  const {
    animValue,
    dotStyle,
    activeDotStyle,
    index,
    count,
    size,
    horizontal,
    children,
    customReanimatedStyle,
    onPress
  } = props;
  const customReanimatedStyleRef = useSharedValue({});

  const handleCustomAnimation = progress => {
    var _customReanimatedStyl;

    customReanimatedStyleRef.value = (_customReanimatedStyl = customReanimatedStyle === null || customReanimatedStyle === void 0 ? void 0 : customReanimatedStyle(progress, index, count)) !== null && _customReanimatedStyl !== void 0 ? _customReanimatedStyl : {};
  };

  useDerivedValue(() => {
    runOnJS(handleCustomAnimation)(animValue === null || animValue === void 0 ? void 0 : animValue.value);
  });
  const animStyle = useAnimatedStyle(() => {
    var _ref, _ref2, _customReanimatedStyl2, _restStyle$transform, _customReanimatedStyl3, _customReanimatedStyl4;

    const {
      width = size || defaultDotSize,
      height = size || defaultDotSize,
      borderRadius,
      backgroundColor = "#FFF",
      ...restDotStyle
    } = dotStyle !== null && dotStyle !== void 0 ? dotStyle : {};
    const {
      width: activeWidth = width,
      height: activeHeight = height,
      borderRadius: activeBorderRadius,
      backgroundColor: activeBackgroundColor = "#000",
      ...restActiveDotStyle
    } = activeDotStyle !== null && activeDotStyle !== void 0 ? activeDotStyle : {};
    let val = Math.abs((animValue === null || animValue === void 0 ? void 0 : animValue.value) - index);
    if (index === 0 && (animValue === null || animValue === void 0 ? void 0 : animValue.value) > count - 1) val = Math.abs((animValue === null || animValue === void 0 ? void 0 : animValue.value) - count);
    const inputRange = [0, 1, 2];
    const restStyle = (_ref = val === 0 ? restActiveDotStyle : restDotStyle) !== null && _ref !== void 0 ? _ref : {};
    return {
      width: interpolate(val, inputRange, [activeWidth, width, width], Extrapolation.CLAMP),
      height: interpolate(val, inputRange, [activeHeight, height, height], Extrapolation.CLAMP),
      borderRadius: interpolate(val, inputRange, [(_ref2 = activeBorderRadius !== null && activeBorderRadius !== void 0 ? activeBorderRadius : borderRadius) !== null && _ref2 !== void 0 ? _ref2 : 0, borderRadius !== null && borderRadius !== void 0 ? borderRadius : 0, borderRadius !== null && borderRadius !== void 0 ? borderRadius : 0], Extrapolation.CLAMP),
      backgroundColor: interpolateColor(val, inputRange, [activeBackgroundColor, backgroundColor, backgroundColor]),
      ...restStyle,
      ...((_customReanimatedStyl2 = customReanimatedStyleRef.value) !== null && _customReanimatedStyl2 !== void 0 ? _customReanimatedStyl2 : {}),
      transform: [...((_restStyle$transform = restStyle === null || restStyle === void 0 ? void 0 : restStyle.transform) !== null && _restStyle$transform !== void 0 ? _restStyle$transform : []), ...((_customReanimatedStyl3 = (_customReanimatedStyl4 = customReanimatedStyleRef.value) === null || _customReanimatedStyl4 === void 0 ? void 0 : _customReanimatedStyl4.transform) !== null && _customReanimatedStyl3 !== void 0 ? _customReanimatedStyl3 : [])]
    };
  }, [animValue, index, count, horizontal, dotStyle, activeDotStyle, customReanimatedStyle]);
  return /*#__PURE__*/React.createElement(TouchableWithoutFeedback, {
    onPress: onPress
  }, /*#__PURE__*/React.createElement(Animated.View, {
    style: [{
      overflow: "hidden",
      transform: [{
        rotateZ: horizontal ? "90deg" : "0deg"
      }]
    }, dotStyle, animStyle]
  }, children));
};
//# sourceMappingURL=PaginationItem.js.map