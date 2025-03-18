import { getCompleteStyle, complete, parseStyleVal, unconfiggedStyle } from '../helpers';
export function widthHeight(type, value, context = {}, config) {
    const configValue = config === null || config === void 0 ? void 0 : config[value];
    if (configValue !== undefined) {
        return getCompleteStyle(type, configValue, context);
    }
    return unconfiggedStyle(type, value, context);
}
export function size(value, context = {}, theme) {
    const width = widthHeight(`width`, value, context, theme === null || theme === void 0 ? void 0 : theme.width);
    const height = widthHeight(`height`, value, context, theme === null || theme === void 0 ? void 0 : theme.height);
    if ((width === null || width === void 0 ? void 0 : width.kind) !== `complete` || (height === null || height === void 0 ? void 0 : height.kind) !== `complete`) {
        return null;
    }
    return complete({ ...width.style, ...height.style });
}
export function minMaxWidthHeight(type, value, context = {}, config) {
    const styleVal = parseStyleVal(config === null || config === void 0 ? void 0 : config[value], context);
    if (styleVal) {
        return complete({ [type]: styleVal });
    }
    if (value === `screen`) {
        value = type.includes(`Width`) ? `100vw` : `100vh`;
    }
    return unconfiggedStyle(type, value, context);
}
