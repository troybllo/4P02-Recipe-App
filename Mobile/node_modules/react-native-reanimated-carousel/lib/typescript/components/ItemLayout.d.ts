import React from "react";
import type { SharedValue } from "react-native-reanimated";
import Animated from "react-native-reanimated";
import { TCarouselProps } from "src/types";
import type { IVisibleRanges } from "../hooks/useVisibleRanges";
export type TAnimationStyle = NonNullable<TCarouselProps["customAnimation"]>;
export declare const ItemLayout: React.FC<{
    index: number;
    handlerOffset: SharedValue<number>;
    visibleRanges: IVisibleRanges;
    animationStyle: TAnimationStyle;
    children: (ctx: {
        animationValue: Animated.SharedValue<number>;
    }) => React.ReactElement;
}>;
