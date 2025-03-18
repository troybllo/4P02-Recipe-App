"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
const helpers_1 = require("../helpers");
const line_height_1 = __importDefault(require("./line-height"));
function fontSize(value, config, context = {}) {
    var _a;
    if (value.includes(`/`)) {
        const [fontSizeValue = ``, lineHeightValue = ``] = value.split(`/`, 2);
        const lh = (0, line_height_1.default)(lineHeightValue, config === null || config === void 0 ? void 0 : config.lineHeight);
        const fs = fontSize(fontSizeValue, config, context);
        if ((fs === null || fs === void 0 ? void 0 : fs.kind) === `complete` && (lh === null || lh === void 0 ? void 0 : lh.kind) === `complete`) {
            return {
                kind: `complete`,
                style: { ...fs.style, ...lh.style },
            };
        }
    }
    const configValue = (_a = config === null || config === void 0 ? void 0 : config.fontSize) === null || _a === void 0 ? void 0 : _a[value];
    if (!configValue) {
        return (0, helpers_1.unconfiggedStyle)(`fontSize`, value, context);
    }
    if (typeof configValue === `string`) {
        return (0, helpers_1.getCompleteStyle)(`fontSize`, configValue);
    }
    let style = {};
    const [sizePart, otherProps] = configValue;
    const fontSizeStyle = (0, helpers_1.getStyle)(`fontSize`, sizePart);
    if (fontSizeStyle) {
        style = fontSizeStyle;
    }
    if (typeof otherProps === `string`) {
        return (0, helpers_1.complete)((0, helpers_1.mergeStyle)(`lineHeight`, calculateLineHeight(otherProps, style), style));
    }
    const { lineHeight, letterSpacing, fontWeight } = otherProps;
    if (lineHeight) {
        (0, helpers_1.mergeStyle)(`lineHeight`, calculateLineHeight(lineHeight, style), style);
    }
    if (letterSpacing) {
        (0, helpers_1.mergeStyle)(`letterSpacing`, letterSpacing, style);
    }
    if (fontWeight) {
        (0, helpers_1.mergeStyle)(`fontWeight`, fontWeight, style);
    }
    return (0, helpers_1.complete)(style);
}
exports.default = fontSize;
// calculates line-height for relative units
function calculateLineHeight(lineHeight, style) {
    const parsed = (0, helpers_1.parseNumericValue)(lineHeight);
    if (parsed) {
        const [number, unit] = parsed;
        if ((unit === types_1.Unit.none || unit === types_1.Unit.em) && typeof style.fontSize === `number`) {
            return style.fontSize * number;
        }
    }
    return lineHeight;
}
