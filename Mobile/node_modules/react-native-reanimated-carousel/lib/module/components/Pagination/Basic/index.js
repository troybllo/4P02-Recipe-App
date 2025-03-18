import { View } from "react-native";
import React from "react";
import { PaginationItem } from "./PaginationItem";
export const Basic = props => {
  const {
    activeDotStyle,
    dotStyle,
    progress,
    horizontal = true,
    data,
    size,
    containerStyle,
    renderItem,
    onPress
  } = props;
  if (typeof size === "string" || typeof (dotStyle === null || dotStyle === void 0 ? void 0 : dotStyle.width) === "string" || typeof (dotStyle === null || dotStyle === void 0 ? void 0 : dotStyle.height) === "string") throw new Error("size/width/height must be a number");
  return /*#__PURE__*/React.createElement(View, {
    style: [{
      justifyContent: "space-between",
      alignSelf: "center"
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
      onPress: () => onPress === null || onPress === void 0 ? void 0 : onPress(index)
    }, renderItem === null || renderItem === void 0 ? void 0 : renderItem(item, index));
  }));
};
//# sourceMappingURL=index.js.map