import React from "react";
import { computedFillDataWithAutoFillData } from "../utils/computed-with-auto-fill-data";
export function useInitProps(props) {
  var _props$enableSnap;

  const {
    defaultIndex = 0,
    data: rawData = [],
    loop = true,
    autoPlayInterval: _autoPlayInterval = 1000,
    scrollAnimationDuration = 500,
    style = {},
    autoFillData = true,
    // switchers
    enabled = true,
    pagingEnabled = true,
    overscrollEnabled = true,
    snapEnabled = (_props$enableSnap = props.enableSnap) !== null && _props$enableSnap !== void 0 ? _props$enableSnap : true,
    width: _width,
    height: _height
  } = props;
  const width = Math.round(_width || 0);
  const height = Math.round(_height || 0);
  const autoPlayInterval = Math.max(_autoPlayInterval, 0);
  const data = React.useMemo(() => {
    return computedFillDataWithAutoFillData({
      loop,
      autoFillData,
      data: rawData,
      dataLength: rawData.length
    });
  }, [rawData, loop, autoFillData]);
  const dataLength = data.length;
  const rawDataLength = rawData.length;

  if (props.mode === "vertical-stack" || props.mode === "horizontal-stack") {
    var _props$modeConfig$sho, _props$modeConfig;

    if (!props.modeConfig) props.modeConfig = {};
    props.modeConfig.showLength = (_props$modeConfig$sho = (_props$modeConfig = props.modeConfig) === null || _props$modeConfig === void 0 ? void 0 : _props$modeConfig.showLength) !== null && _props$modeConfig$sho !== void 0 ? _props$modeConfig$sho : dataLength - 1;
  }

  return { ...props,
    defaultIndex,
    autoFillData,
    // Fill data with autoFillData
    data,
    // Length of fill data
    dataLength,
    // Raw data that has not been processed
    rawData,
    // Length of raw data
    rawDataLength,
    loop,
    enabled,
    autoPlayInterval,
    scrollAnimationDuration,
    style,
    pagingEnabled,
    snapEnabled,
    overscrollEnabled,
    width,
    height
  };
}
//# sourceMappingURL=useInitProps.js.map