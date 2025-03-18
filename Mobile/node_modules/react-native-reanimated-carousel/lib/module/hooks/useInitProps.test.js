import React from "react";
import { Text } from "react-native";
import { renderHook } from "@testing-library/react-hooks";
import { useInitProps } from "./useInitProps";
describe("useInitProps", () => {
  const defaultData = [1, 2, 3, 4];
  const defaultProps = {
    data: defaultData,
    width: 300,
    height: 200,
    renderItem: _ref => {
      let {
        item: _item
      } = _ref;
      return /*#__PURE__*/React.createElement(Text, null, "Item");
    }
  };
  it("should initialize with default values", () => {
    const {
      result
    } = renderHook(() => useInitProps(defaultProps));
    expect(result.current).toEqual(expect.objectContaining({
      defaultIndex: 0,
      loop: true,
      autoPlayInterval: 1000,
      scrollAnimationDuration: 500,
      width: 300,
      height: 200,
      enabled: true,
      autoFillData: true,
      pagingEnabled: true,
      snapEnabled: true,
      overscrollEnabled: true,
      data: defaultData,
      rawData: defaultData,
      dataLength: 4,
      rawDataLength: 4
    }));
  });
  it("should handle custom values", () => {
    const customProps = { ...defaultProps,
      defaultIndex: 2,
      loop: false,
      autoPlayInterval: 2000,
      scrollAnimationDuration: 300,
      enabled: false,
      autoFillData: false,
      pagingEnabled: false,
      snapEnabled: false,
      overscrollEnabled: false
    };
    const {
      result
    } = renderHook(() => useInitProps(customProps));
    expect(result.current).toEqual(expect.objectContaining({ ...customProps,
      data: defaultData,
      rawData: defaultData,
      dataLength: 4,
      rawDataLength: 4
    }));
  });
  it("should handle stack mode configuration", () => {
    const stackProps = { ...defaultProps,
      mode: "horizontal-stack",
      modeConfig: {
        showLength: 3
      }
    };
    const {
      result
    } = renderHook(() => useInitProps(stackProps));
    expect(result.current.modeConfig).toBeDefined();
    if (result.current.modeConfig && "showLength" in result.current.modeConfig) expect(result.current.modeConfig.showLength).toBe(3); // dataLength - 1
  });
  it("should handle empty data array", () => {
    const props = { ...defaultProps,
      data: []
    };
    const {
      result
    } = renderHook(() => useInitProps(props));
    expect(result.current.dataLength).toBe(0);
    expect(result.current.rawDataLength).toBe(0);
  });
  it("should round width and height values", () => {
    const props = { ...defaultProps,
      width: 300.6,
      height: 200.4
    };
    const {
      result
    } = renderHook(() => useInitProps(props));
    expect(result.current.width).toBe(301);
    expect(result.current.height).toBe(200);
  });
  it("should handle enableSnap property", () => {
    const props = { ...defaultProps,
      enableSnap: false
    };
    const {
      result
    } = renderHook(() => useInitProps(props));
    expect(result.current.snapEnabled).toBe(false);
  });
  it("should handle vertical-stack mode", () => {
    const props = { ...defaultProps,
      mode: "vertical-stack",
      modeConfig: {
        showLength: 3
      }
    };
    const {
      result
    } = renderHook(() => useInitProps(props));
    expect(result.current.modeConfig).toBeDefined();
    if (result.current.modeConfig && "showLength" in result.current.modeConfig) expect(result.current.modeConfig.showLength).toBe(3); // dataLength - 1
  });
});
//# sourceMappingURL=useInitProps.test.js.map