import React from "react";
import { TouchableWithoutFeedback, View } from "react-native";
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from "react-native-reanimated";
export const PaginationItem = props => {
  const {
    animValue,
    dotStyle,
    activeDotStyle,
    index,
    count,
    size,
    horizontal,
    children,
    onPress
  } = props;
  const defaultDotSize = 10;
  const sizes = {
    width: size || (dotStyle === null || dotStyle === void 0 ? void 0 : dotStyle.width) || defaultDotSize,
    height: size || (dotStyle === null || dotStyle === void 0 ? void 0 : dotStyle.height) || defaultDotSize
  };
  /**
   * TODO: Keep this for future implementation
   * Used to change the size of the active dot with animation
   */
  // const animatedSize = {
  //   width: activeDotStyle?.width,
  //   height: activeDotStyle?.height,
  // };

  const width = sizes.width;
  const height = sizes.height;
  const animStyle = useAnimatedStyle(() => {
    const size = horizontal ? height : width;
    let inputRange = [index - 1, index, index + 1];
    let outputRange = [-size, 0, size];

    if (index === 0 && (animValue === null || animValue === void 0 ? void 0 : animValue.value) > count - 1) {
      inputRange = [count - 1, count, count + 1];
      outputRange = [-size, 0, size];
    }

    return {
      transform: [{
        translateX: interpolate(animValue === null || animValue === void 0 ? void 0 : animValue.value, inputRange, outputRange, Extrapolation.CLAMP)
      }]
    };
  }, [animValue, index, count, horizontal]);
  return /*#__PURE__*/React.createElement(TouchableWithoutFeedback, {
    onPress: onPress
  }, /*#__PURE__*/React.createElement(View, {
    style: [{
      width,
      height,
      overflow: "hidden",
      transform: [{
        rotateZ: horizontal ? "90deg" : "0deg"
      }]
    }, dotStyle]
  }, /*#__PURE__*/React.createElement(Animated.View, {
    style: [{
      backgroundColor: "black",
      flex: 1
    }, animStyle, activeDotStyle]
  }, children)));
};
//# sourceMappingURL=PaginationItem.js.map