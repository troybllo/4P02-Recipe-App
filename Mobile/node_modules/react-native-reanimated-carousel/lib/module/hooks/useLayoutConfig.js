import React from "react";
import { Layouts } from "../layouts";
export function useLayoutConfig(opts) {
  const {
    size,
    vertical
  } = opts;
  return React.useMemo(() => {
    const baseConfig = {
      size,
      vertical
    };

    switch (opts.mode) {
      case "parallax":
        return Layouts.parallax(baseConfig, opts.modeConfig);

      case "horizontal-stack":
        return Layouts.horizontalStack(opts.modeConfig);

      case "vertical-stack":
        return Layouts.verticalStack(opts.modeConfig);

      default:
        return Layouts.normal(baseConfig);
    }
  }, [opts.mode, opts.modeConfig, size, vertical]);
}
//# sourceMappingURL=useLayoutConfig.js.map