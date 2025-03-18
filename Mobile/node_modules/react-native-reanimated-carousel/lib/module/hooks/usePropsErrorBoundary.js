import React from "react";
export function usePropsErrorBoundary(props) {
  React.useEffect(() => {
    const {
      defaultIndex,
      dataLength: viewCount
    } = props;

    if (typeof defaultIndex === "number" && viewCount > 0) {
      if (defaultIndex < 0 || defaultIndex >= viewCount) {
        throw new Error("DefaultIndex must be in the range of data length.");
      }
    } // TODO


    if (!props.mode || props.mode === "parallax") {
      if (!props.vertical && !props.width) {
        throw new Error("`width` must be specified for horizontal carousels.");
      }

      if (props.vertical && !props.height) {
        throw new Error("`height` must be specified for vertical carousels.");
      }
    }
  }, [props]);
}
//# sourceMappingURL=usePropsErrorBoundary.js.map