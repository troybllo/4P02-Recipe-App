"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.minMaxWidthHeight = exports.size = exports.widthHeight = void 0;
const helpers_1 = require("../helpers");
function widthHeight(type, value, context = {}, config) {
    const configValue = config === null || config === void 0 ? void 0 : config[value];
    if (configValue !== undefined) {
        return (0, helpers_1.getCompleteStyle)(type, configValue, context);
    }
    return (0, helpers_1.unconfiggedStyle)(type, value, context);
}
exports.widthHeight = widthHeight;
function size(value, context = {}, theme) {
    const width = widthHeight(`width`, value, context, theme === null || theme === void 0 ? void 0 : theme.width);
    const height = widthHeight(`height`, value, context, theme === null || theme === void 0 ? void 0 : theme.height);
    if ((width === null || width === void 0 ? void 0 : width.kind) !== `complete` || (height === null || height === void 0 ? void 0 : height.kind) !== `complete`) {
        return null;
    }
    return (0, helpers_1.complete)({ ...width.style, ...height.style });
}
exports.size = size;
function minMaxWidthHeight(type, value, context = {}, config) {
    const styleVal = (0, helpers_1.parseStyleVal)(config === null || config === void 0 ? void 0 : config[value], context);
    if (styleVal) {
        return (0, helpers_1.complete)({ [type]: styleVal });
    }
    if (value === `screen`) {
        value = type.includes(`Width`) ? `100vw` : `100vh`;
    }
    return (0, helpers_1.unconfiggedStyle)(type, value, context);
}
exports.minMaxWidthHeight = minMaxWidthHeight;
