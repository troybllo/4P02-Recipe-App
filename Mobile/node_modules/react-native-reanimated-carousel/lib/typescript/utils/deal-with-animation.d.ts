import type { WithAnimation } from "../types";
export declare function dealWithAnimation(withAnimation: WithAnimation): (value: number, cb: (isFinished: boolean) => void) => number;
