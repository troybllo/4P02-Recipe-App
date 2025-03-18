import React from "react";
import { useSharedValue } from "react-native-reanimated";
export const GlobalStateContext = /*#__PURE__*/React.createContext({});
export const GlobalStateProvider = _ref => {
  let {
    children,
    value
  } = _ref;
  const containerSize = useSharedValue({
    width: 0,
    height: 0
  });
  const itemDimensions = useSharedValue({});

  const updateItemDimensions = (index, dimensions) => {
    "worklet";

    itemDimensions.value = { ...itemDimensions.value,
      [index]: dimensions
    };
  };

  const updateContainerSize = dimensions => {
    "worklet";

    containerSize.value = dimensions;
  };

  return /*#__PURE__*/React.createElement(GlobalStateContext.Provider, {
    value: { ...value,
      layout: {
        containerSize,
        itemDimensions,
        updateItemDimensions,
        updateContainerSize
      }
    }
  }, children);
};
export const useGlobalState = () => {
  const context = React.useContext(GlobalStateContext);

  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }

  return context;
};
//# sourceMappingURL=index.js.map