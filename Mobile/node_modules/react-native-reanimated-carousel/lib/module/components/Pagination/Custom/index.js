import React from "react";
import { View } from "react-native";
import { PaginationItem } from "./PaginationItem";
export const Custom = props => {
  var _dotStyle$width, _activeDotStyle$width, _dotStyle$height, _activeDotStyle$heigh;

  const {
    activeDotStyle,
    dotStyle,
    progress,
    horizontal = true,
    data,
    size,
    containerStyle,
    renderItem,
    onPress,
    customReanimatedStyle
  } = props;
  if (typeof size === "string" || typeof (dotStyle === null || dotStyle === void 0 ? void 0 : dotStyle.width) === "string" || typeof (dotStyle === null || dotStyle === void 0 ? void 0 : dotStyle.height) === "string" || typeof (activeDotStyle === null || activeDotStyle === void 0 ? void 0 : activeDotStyle.width) === "string" || typeof (activeDotStyle === null || activeDotStyle === void 0 ? void 0 : activeDotStyle.height) === "string") throw new Error("size/width/height must be a number");
  const maxItemWidth = Math.max(size !== null && size !== void 0 ? size : 0, (_dotStyle$width = dotStyle === null || dotStyle === void 0 ? void 0 : dotStyle.width) !== null && _dotStyle$width !== void 0 ? _dotStyle$width : 0, (_activeDotStyle$width = activeDotStyle === null || activeDotStyle === void 0 ? void 0 : activeDotStyle.width) !== null && _activeDotStyle$width !== void 0 ? _activeDotStyle$width : 0);
  const maxItemHeight = Math.max(size !== null && size !== void 0 ? size : 0, (_dotStyle$height = dotStyle === null || dotStyle === void 0 ? void 0 : dotStyle.height) !== null && _dotStyle$height !== void 0 ? _dotStyle$height : 0, (_activeDotStyle$heigh = activeDotStyle === null || activeDotStyle === void 0 ? void 0 : activeDotStyle.height) !== null && _activeDotStyle$heigh !== void 0 ? _activeDotStyle$heigh : 0);
  return /*#__PURE__*/React.createElement(View, {
    style: [{
      justifyContent: "space-between",
      alignSelf: "center",
      minWidth: maxItemWidth,
      minHeight: maxItemHeight
    }, horizontal ? {
      flexDirection: "row"
    } : {
      flexDirection: "column"
    }, containerStyle]
  }, data.map((item, index) => {
    return /*#__PURE__*/React.createElement(PaginationItem, {
      key: index,
      index: index,
      size: size,
      count: data.length,
      dotStyle: dotStyle,
      animValue: progress,
      horizontal: !horizontal,
      activeDotStyle: activeDotStyle,
      customReanimatedStyle: customReanimatedStyle,
      onPress: () => onPress === null || onPress === void 0 ? void 0 : onPress(index)
    }, renderItem === null || renderItem === void 0 ? void 0 : renderItem(item, index));
  }));
};
//# sourceMappingURL=index.js.map