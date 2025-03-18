import type Animated from "react-native-reanimated";
type Range = [number, number];
export interface VisibleRanges {
    negativeRange: Range;
    positiveRange: Range;
}
export type IVisibleRanges = Animated.SharedValue<VisibleRanges>;
export declare function useVisibleRanges(options: {
    total: number;
    viewSize: number;
    windowSize?: number;
    translation: Animated.SharedValue<number>;
    loop?: boolean;
}): IVisibleRanges;
export {};
