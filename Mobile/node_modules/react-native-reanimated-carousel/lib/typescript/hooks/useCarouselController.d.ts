import React from "react";
import { SharedValue } from "react-native-reanimated";
import type { ICarouselInstance, TCarouselActionOptions, TCarouselProps } from "../types";
interface IOpts {
    ref: React.ForwardedRef<ICarouselInstance>;
    loop: boolean;
    size: number;
    dataLength: number;
    handlerOffset: SharedValue<number>;
    autoFillData: TCarouselProps["autoFillData"];
    withAnimation?: TCarouselProps["withAnimation"];
    fixedDirection?: TCarouselProps["fixedDirection"];
    duration?: number;
    defaultIndex?: number;
    onScrollStart?: () => void;
    onScrollEnd?: () => void;
}
export interface ICarouselController {
    getSharedIndex: () => number;
    prev: (opts?: TCarouselActionOptions) => void;
    next: (opts?: TCarouselActionOptions) => void;
    getCurrentIndex: () => number;
    scrollTo: (opts?: TCarouselActionOptions) => void;
    index: SharedValue<number>;
}
export declare function useCarouselController(options: IOpts): ICarouselController;
export {};
