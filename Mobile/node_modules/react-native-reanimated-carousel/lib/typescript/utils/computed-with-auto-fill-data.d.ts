type BaseParams<T extends object> = {
    autoFillData: boolean;
    loop: boolean;
} & T;
export declare function convertToSharedIndex(params: BaseParams<{
    index: number;
    rawDataLength: number;
}>): number;
export declare function computedOffsetXValueWithAutoFillData(params: BaseParams<{
    rawDataLength: number;
    value: number;
    size: number;
}>): number;
export declare function computedRealIndexWithAutoFillData(params: BaseParams<{
    index: number;
    dataLength: number;
}>): number;
export declare function computedFillDataWithAutoFillData<T>(params: BaseParams<{
    data: T[];
    dataLength: number;
}>): T[];
export {};
