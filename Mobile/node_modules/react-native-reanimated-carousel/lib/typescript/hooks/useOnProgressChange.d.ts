import type Animated from "react-native-reanimated";
import type { TCarouselProps } from "../types";
export declare function useOnProgressChange(opts: {
    size: number;
    autoFillData: boolean;
    loop: boolean;
    offsetX: Animated.SharedValue<number>;
    rawDataLength: number;
} & Pick<TCarouselProps, "onProgressChange">): void;
