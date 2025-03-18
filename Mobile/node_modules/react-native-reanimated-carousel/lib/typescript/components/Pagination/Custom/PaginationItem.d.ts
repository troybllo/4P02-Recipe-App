import type { PropsWithChildren } from "react";
import React from "react";
import type { ViewStyle } from "react-native";
import type { SharedValue } from "react-native-reanimated";
import type { DefaultStyle } from "react-native-reanimated/lib/typescript/reanimated2/hook/commonTypes";
export type DotStyle = Omit<ViewStyle, "width" | "height" | "backgroundColor" | "borderRadius"> & {
    width?: number;
    height?: number;
    backgroundColor?: string;
    borderRadius?: number;
};
export declare const PaginationItem: React.FC<PropsWithChildren<{
    index: number;
    count: number;
    size?: number;
    animValue: SharedValue<number>;
    horizontal?: boolean;
    dotStyle?: DotStyle;
    activeDotStyle?: DotStyle;
    onPress: () => void;
    customReanimatedStyle?: (progress: number, index: number, length: number) => DefaultStyle;
}>>;
