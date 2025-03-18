import type { FC } from "react";
import type { ViewStyle } from "react-native";
import type { SharedValue } from "react-native-reanimated";
import type { TAnimationStyle } from "./ItemLayout";
import type { CarouselRenderItem } from "../types";
interface Props {
    data: any[];
    dataLength: number;
    rawDataLength: number;
    loop: boolean;
    size: number;
    windowSize?: number;
    autoFillData: boolean;
    offsetX: SharedValue<number>;
    handlerOffset: SharedValue<number>;
    layoutConfig: TAnimationStyle;
    renderItem: CarouselRenderItem<any>;
    customAnimation?: (value: number, index: number) => ViewStyle;
}
export declare const ItemRenderer: FC<Props>;
export {};
