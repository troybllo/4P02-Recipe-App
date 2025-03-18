import type { GestureStateChangeEvent, GestureUpdateEvent, PanGesture, PanGestureHandlerEventPayload } from "react-native-gesture-handler";
import type { GestureConfig } from "./useUpdateGestureConfig";
export declare const usePanGestureProxy: (customization: {
    onConfigurePanGesture?: (gesture: PanGesture) => void;
    onGestureStart: (event: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => void;
    onGestureUpdate: (event: GestureUpdateEvent<PanGestureHandlerEventPayload>) => void;
    onGestureEnd: (event: GestureStateChangeEvent<PanGestureHandlerEventPayload>, success: boolean) => void;
    options?: GestureConfig;
}) => import("react-native-gesture-handler/lib/typescript/handlers/gestures/panGesture").PanGesture;
