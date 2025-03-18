import type { TCarouselProps } from "../types";
type TGetRequiredProps<P extends keyof TCarouselProps> = Record<P, Required<TCarouselProps>[P]>;
export type TInitializeCarouselProps<T> = TCarouselProps<T> & TGetRequiredProps<"defaultIndex" | "loop" | "width" | "height" | "scrollAnimationDuration" | "autoPlayInterval" | "autoFillData"> & {
    rawData: T[];
    dataLength: number;
    rawDataLength: number;
};
export declare function useInitProps<T>(props: TCarouselProps<T>): TInitializeCarouselProps<T>;
export {};
