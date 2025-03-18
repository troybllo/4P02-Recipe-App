import { normalLayout } from "./normal";
import { parallaxLayout } from "./parallax";
import { horizontalStackLayout, verticalStackLayout } from "./stack";
export type TMode = "parallax" | "horizontal-stack" | "vertical-stack";
export declare const Layouts: {
    normal: typeof normalLayout;
    parallax: typeof parallaxLayout;
    horizontalStack: typeof horizontalStackLayout;
    verticalStack: typeof verticalStackLayout;
};
