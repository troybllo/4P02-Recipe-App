import React from "react";
import { useCommonVariables } from "../hooks/useCommonVariables";
import { useInitProps } from "../hooks/useInitProps";
import { usePropsErrorBoundary } from "../hooks/usePropsErrorBoundary";
import { GlobalStateProvider } from "../store";
import { CarouselLayout } from "./CarouselLayout";
const Carousel = /*#__PURE__*/React.forwardRef((_props, ref) => {
  const props = useInitProps(_props);
  const {
    dataLength
  } = props;
  const commonVariables = useCommonVariables(props);
  usePropsErrorBoundary({ ...props,
    dataLength
  });
  return /*#__PURE__*/React.createElement(GlobalStateProvider, {
    value: {
      props,
      common: commonVariables
    }
  }, /*#__PURE__*/React.createElement(CarouselLayout, {
    ref: ref
  }));
});
export default Carousel;
//# sourceMappingURL=Carousel.js.map