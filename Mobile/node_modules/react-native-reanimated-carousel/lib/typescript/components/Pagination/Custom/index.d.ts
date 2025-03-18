import React from "react";
import type { StyleProp, ViewStyle } from "react-native";
import type { SharedValue } from "react-native-reanimated";
import type { DefaultStyle } from "react-native-reanimated/lib/typescript/reanimated2/hook/commonTypes";
import type { DotStyle } from "./PaginationItem";
export interface ShapeProps<T extends {}> {
    progress: SharedValue<number>;
    horizontal?: boolean;
    data: Array<T>;
    renderItem?: (item: T, index: number) => React.ReactNode;
    containerStyle?: StyleProp<ViewStyle>;
    dotStyle?: DotStyle;
    activeDotStyle?: DotStyle;
    size?: number;
    onPress?: (index: number) => void;
    customReanimatedStyle?: (progress: number, index: number, length: number) => DefaultStyle;
}
export declare const Custom: <T extends {}>(props: ShapeProps<T>) => React.JSX.Element;
