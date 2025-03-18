export declare function normalLayout(opts: {
    size: number;
    vertical: boolean;
}): (value: number) => {
    transform: ({
        translateY: number;
        translateX?: undefined;
    } | {
        translateX: number;
        translateY?: undefined;
    })[];
};
