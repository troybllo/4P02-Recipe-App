import type { PropsWithChildren } from "react";
import React from "react";
import type { ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
export type DotStyle = Omit<ViewStyle, "width" | "height"> & {
    width?: number;
    height?: number;
};
export declare const PaginationItem: React.FC<PropsWithChildren<{
    index: number;
    count: number;
    size?: number;
    animValue: Animated.SharedValue<number>;
    horizontal?: boolean;
    dotStyle?: DotStyle;
    activeDotStyle?: DotStyle;
    onPress: () => void;
}>>;
