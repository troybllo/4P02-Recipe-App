import type { PanGesture } from "react-native-gesture-handler";
export interface GestureConfig {
    enabled?: boolean;
}
export declare const useUpdateGestureConfig: (gesture: PanGesture, config: GestureConfig) => void;
