import type Animated from "react-native-reanimated";
import type { IVisibleRanges } from "./useVisibleRanges";
export interface IOpts {
    index: number;
    size: number;
    handlerOffset: Animated.SharedValue<number>;
    dataLength: number;
    type?: "positive" | "negative";
    viewCount?: number;
    loop?: boolean;
}
export declare const useOffsetX: (opts: IOpts, visibleRanges: IVisibleRanges) => Readonly<import("react-native-reanimated").SharedValue<number>>;
