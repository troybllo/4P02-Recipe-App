import { useMemo } from "react";
import { Gesture } from "react-native-gesture-handler";
import { useUpdateGestureConfig } from "./useUpdateGestureConfig";
export const usePanGestureProxy = customization => {
  const {
    onConfigurePanGesture,
    onGestureStart,
    onGestureUpdate,
    onGestureEnd,
    options = {}
  } = customization;
  const gesture = useMemo(() => {
    const gesture = Gesture.Pan().withTestId("rnrc-gesture-handler"); // Save the original gesture callbacks

    const originalGestures = {
      onBegin: gesture.onBegin,
      onStart: gesture.onStart,
      onUpdate: gesture.onUpdate,
      onEnd: gesture.onEnd,
      onFinalize: gesture.onFinalize
    }; // Save the user defined gesture callbacks

    const userDefinedConflictGestures = {
      onBegin: undefined,
      onStart: undefined,
      onUpdate: undefined,
      onEnd: undefined,
      onFinalize: undefined
    };

    const fakeOnBegin = cb => {
      // Using fakeOnBegin to save the user defined callback
      userDefinedConflictGestures.onBegin = cb;
      return gesture;
    };

    const fakeOnStart = cb => {
      // Using fakeOnStart to save the user defined callback
      userDefinedConflictGestures.onStart = cb;
      return gesture;
    };

    const fakeOnUpdate = cb => {
      // Using fakeOnUpdate to save the user defined callback
      userDefinedConflictGestures.onUpdate = cb;
      return gesture;
    };

    const fakeOnEnd = cb => {
      // Using fakeOnEnd to save the user defined callback
      userDefinedConflictGestures.onEnd = cb;
      return gesture;
    };

    const fakeOnFinalize = cb => {
      // Using fakeOnFinalize to save the user defined callback
      userDefinedConflictGestures.onFinalize = cb;
      return gesture;
    }; // Setup the fake callbacks


    gesture.onBegin = fakeOnBegin;
    gesture.onStart = fakeOnStart;
    gesture.onUpdate = fakeOnUpdate;
    gesture.onEnd = fakeOnEnd;
    gesture.onFinalize = fakeOnFinalize;
    if (onConfigurePanGesture) // Get the gesture with the user defined configuration
      onConfigurePanGesture(gesture); // Restore the original callbacks

    gesture.onBegin = originalGestures.onBegin;
    gesture.onStart = originalGestures.onStart;
    gesture.onUpdate = originalGestures.onUpdate;
    gesture.onEnd = originalGestures.onEnd;
    gesture.onFinalize = originalGestures.onFinalize; // Setup the original callbacks with the user defined callbacks

    gesture.onBegin(e => {
      "worklet";

      if (userDefinedConflictGestures.onBegin) userDefinedConflictGestures.onBegin(e);
    }).onStart(e => {
      "worklet";

      onGestureStart(e);
      if (userDefinedConflictGestures.onStart) userDefinedConflictGestures.onStart(e);
    }).onUpdate(e => {
      "worklet";

      onGestureUpdate(e);
      if (userDefinedConflictGestures.onUpdate) userDefinedConflictGestures.onUpdate(e);
    }).onEnd((e, success) => {
      "worklet";

      onGestureEnd(e, success);
      if (userDefinedConflictGestures.onEnd) userDefinedConflictGestures.onEnd(e, success);
    }).onFinalize((e, success) => {
      "worklet";

      if (userDefinedConflictGestures.onFinalize) userDefinedConflictGestures.onFinalize(e, success);
    });
    return gesture;
  }, [onGestureStart, onGestureUpdate, onGestureEnd, onConfigurePanGesture]);
  useUpdateGestureConfig(gesture, options);
  return gesture;
};
//# sourceMappingURL=usePanGestureProxy.js.map