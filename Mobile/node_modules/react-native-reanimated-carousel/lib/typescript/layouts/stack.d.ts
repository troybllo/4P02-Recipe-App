import type { ViewStyle } from "react-native";
import type { CustomConfig, IComputedDirectionTypes } from "../types";
export interface ILayoutConfig {
    showLength?: number;
    moveSize?: number;
    stackInterval?: number;
    scaleInterval?: number;
    opacityInterval?: number;
    rotateZDeg?: number;
    snapDirection?: "left" | "right";
}
export type TStackModeProps = IComputedDirectionTypes<{
    /**
     * Carousel Animated transitions.
     */
    mode?: "horizontal-stack" | "vertical-stack";
    /**
     * Stack animation style.
     * @default
     *     snapDirection: 'right',
     *     moveSize: window.width,
     *     stackInterval: 30,
     *     scaleInterval: 0.08,
     *     rotateZDeg: 135,
     *     opacityInterval: 0.1,
     */
    modeConfig?: ILayoutConfig;
}>;
export declare function horizontalStackLayout(modeConfig?: ILayoutConfig): (_value: number) => ViewStyle;
export declare function useHorizontalStackLayout(customAnimationConfig?: ILayoutConfig, customConfig?: CustomConfig): {
    layout: (_value: number) => ViewStyle;
    config: {
        type: string;
        viewCount: number;
    };
};
export declare function verticalStackLayout(modeConfig?: ILayoutConfig): (_value: number) => ViewStyle;
