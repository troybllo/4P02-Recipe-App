import React from "react";
import { runOnJS, useAnimatedReaction } from "react-native-reanimated";
import { ItemLayout } from "./ItemLayout";
import { useVisibleRanges } from "../hooks/useVisibleRanges";
import { computedRealIndexWithAutoFillData } from "../utils/computed-with-auto-fill-data";
export const ItemRenderer = props => {
  const {
    data,
    size,
    windowSize,
    handlerOffset,
    offsetX,
    dataLength,
    rawDataLength,
    loop,
    autoFillData,
    layoutConfig,
    renderItem,
    customAnimation
  } = props;
  const visibleRanges = useVisibleRanges({
    total: dataLength,
    viewSize: size,
    translation: handlerOffset,
    windowSize,
    loop
  });
  const [displayedItems, setDisplayedItems] = React.useState(null);
  useAnimatedReaction(() => visibleRanges.value, ranges => runOnJS(setDisplayedItems)(ranges), [visibleRanges]);
  if (!displayedItems) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, data.map((item, index) => {
    const realIndex = computedRealIndexWithAutoFillData({
      index,
      dataLength: rawDataLength,
      loop,
      autoFillData
    });
    const {
      negativeRange,
      positiveRange
    } = displayedItems;
    const shouldRender = index >= negativeRange[0] && index <= negativeRange[1] || index >= positiveRange[0] && index <= positiveRange[1];
    if (!shouldRender) return null;
    return /*#__PURE__*/React.createElement(ItemLayout, {
      key: index,
      index: index,
      handlerOffset: offsetX,
      visibleRanges: visibleRanges,
      animationStyle: customAnimation || layoutConfig
    }, _ref => {
      let {
        animationValue
      } = _ref;
      return renderItem({
        item,
        index: realIndex,
        animationValue
      });
    });
  }));
};
//# sourceMappingURL=ItemRenderer.js.map