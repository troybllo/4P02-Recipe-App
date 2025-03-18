import React from "react";
import { SharedValue } from "react-native-reanimated";
import type { TInitializeCarouselProps } from "../hooks/useInitProps";
type ItemDimensions = Record<number, {
    width: number;
    height: number;
}>;
export interface IContext {
    props: TInitializeCarouselProps<any>;
    common: {
        size: number;
        validLength: number;
    };
    layout: {
        containerSize: SharedValue<{
            width: number;
            height: number;
        }>;
        updateContainerSize: (dimensions: {
            width: number;
            height: number;
        }) => void;
        itemDimensions: SharedValue<ItemDimensions>;
        updateItemDimensions: (index: number, dimensions: {
            width: number;
            height: number;
        }) => void;
    };
}
export declare const GlobalStateContext: React.Context<IContext>;
export declare const GlobalStateProvider: ({ children, value, }: {
    children: React.ReactNode;
    value: Pick<IContext, "props" | "common">;
}) => React.JSX.Element;
export declare const useGlobalState: () => IContext;
export {};
