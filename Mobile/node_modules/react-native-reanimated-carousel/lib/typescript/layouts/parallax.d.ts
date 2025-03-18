import type { IComputedDirectionTypes } from "../types";
interface TBaseConfig {
    size: number;
    vertical: boolean;
}
export interface ILayoutConfig {
    /**
     * control prev/next item offset.
     * @default 100
     */
    parallaxScrollingOffset?: number;
    /**
     * control prev/current/next item offset.
     * @default 0.8
     */
    parallaxScrollingScale?: number;
    /**
     * control prev/next item offset.
     * @default Math.pow(parallaxScrollingScale, 2)
     */
    parallaxAdjacentItemScale?: number;
}
export type TParallaxModeProps = IComputedDirectionTypes<{
    /**
     * Carousel Animated transitions.
     */
    mode?: "parallax";
    modeConfig?: ILayoutConfig;
}>;
export declare function parallaxLayout(baseConfig: TBaseConfig, modeConfig?: ILayoutConfig): (value: number) => {
    transform: ({
        translateY: number;
        translateX?: undefined;
        scale?: undefined;
    } | {
        translateX: number;
        translateY?: undefined;
        scale?: undefined;
    } | {
        scale: number;
        translateY?: undefined;
        translateX?: undefined;
    })[];
    zIndex: number;
};
export {};
