import React from "react";
import { type ViewStyle } from "react-native";
import { ICarouselInstance } from "../types";
export type TAnimationStyle = (value: number) => ViewStyle;
export declare const CarouselLayout: React.ForwardRefExoticComponent<React.RefAttributes<ICarouselInstance>>;
