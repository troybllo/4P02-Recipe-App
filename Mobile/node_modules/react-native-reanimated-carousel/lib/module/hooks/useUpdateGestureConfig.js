import { useEffect } from "react";
export const useUpdateGestureConfig = (gesture, config) => {
  const {
    enabled
  } = config;
  useEffect(() => {
    if (typeof enabled !== "undefined") gesture.enabled(enabled);
  }, [enabled, gesture]);
};
//# sourceMappingURL=useUpdateGestureConfig.js.map