import type { PropsWithChildren } from "react";
import React from "react";
import type { LayoutChangeEvent, StyleProp, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
interface Props {
    size: number;
    infinite?: boolean;
    testID?: string;
    style?: StyleProp<ViewStyle>;
    translation: Animated.SharedValue<number>;
    onLayout?: (e: LayoutChangeEvent) => void;
    onScrollStart?: () => void;
    onScrollEnd?: () => void;
    onTouchBegin?: () => void;
    onTouchEnd?: () => void;
}
export declare const ScrollViewGesture: React.FC<PropsWithChildren<Props>>;
export {};
