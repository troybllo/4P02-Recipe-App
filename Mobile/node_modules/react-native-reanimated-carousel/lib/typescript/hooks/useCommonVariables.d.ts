import type Animated from "react-native-reanimated";
import type { TInitializeCarouselProps } from "./useInitProps";
interface ICommonVariables {
    size: number;
    validLength: number;
    handlerOffset: Animated.SharedValue<number>;
}
export declare function useCommonVariables(props: TInitializeCarouselProps<any>): ICommonVariables;
export {};
