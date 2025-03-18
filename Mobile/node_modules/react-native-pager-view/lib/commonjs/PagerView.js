"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PagerView = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _utils = require("./utils");
var _PagerViewNativeComponent = _interopRequireWildcard(require("./PagerViewNativeComponent"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Container that allows to flip left and right between child views. Each
 * child view of the `PagerView` will be treated as a separate page
 * and will be stretched to fill the `PagerView`.
 *
 * It is important all children are `<View>`s and not composite components.
 * You can set style properties like `padding` or `backgroundColor` for each
 * child. It is also important that each child have a `key` prop.
 *
 * Example:
 *
 * ```
 * render: function() {
 *   return (
 *     <PagerView
 *       style={styles.PagerView}
 *       initialPage={0}>
 *       <View style={styles.pageStyle} key="1">
 *         <Text>First page</Text>
 *       </View>
 *       <View style={styles.pageStyle} key="2">
 *         <Text>Second page</Text>
 *       </View>
 *     </PagerView>
 *   );
 * }
 *
 * ...
 *
 * var styles = {
 *   ...
 *   PagerView: {
 *     flex: 1
 *   },
 *   pageStyle: {
 *     alignItems: 'center',
 *     padding: 20,
 *   }
 * }
 * ```
 */

class PagerView extends _react.default.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "isScrolling", false);
    _defineProperty(this, "pagerView", null);
    _defineProperty(this, "_onPageScroll", e => {
      if (this.props.onPageScroll) {
        this.props.onPageScroll(e);
      }

      // Not implemented on iOS yet
      if (_reactNative.Platform.OS === 'android') {
        if (this.props.keyboardDismissMode === 'on-drag') {
          _reactNative.Keyboard.dismiss();
        }
      }
    });
    _defineProperty(this, "_onPageScrollStateChanged", e => {
      if (this.props.onPageScrollStateChanged) {
        this.props.onPageScrollStateChanged(e);
      }
      this.isScrolling = e.nativeEvent.pageScrollState === 'dragging';
    });
    _defineProperty(this, "_onPageSelected", e => {
      if (this.props.onPageSelected) {
        this.props.onPageSelected(e);
      }
    });
    _defineProperty(this, "_onMoveShouldSetResponderCapture", () => {
      return this.isScrolling;
    });
    /**
     * A helper function to scroll to a specific page in the PagerView.
     * The transition between pages will be animated.
     */
    _defineProperty(this, "setPage", selectedPage => {
      if (this.pagerView) {
        _PagerViewNativeComponent.Commands.setPage(this.pagerView, selectedPage);
      }
    });
    /**
     * A helper function to scroll to a specific page in the PagerView.
     * The transition between pages will *not* be animated.
     */
    _defineProperty(this, "setPageWithoutAnimation", selectedPage => {
      if (this.pagerView) {
        _PagerViewNativeComponent.Commands.setPageWithoutAnimation(this.pagerView, selectedPage);
      }
    });
    /**
     * A helper function to enable/disable scroll imperatively
     * The recommended way is using the scrollEnabled prop, however, there might be a case where a
     * imperative solution is more useful (e.g. for not blocking an animation)
     */
    _defineProperty(this, "setScrollEnabled", scrollEnabled => {
      if (this.pagerView) {
        _PagerViewNativeComponent.Commands.setScrollEnabledImperatively(this.pagerView, scrollEnabled);
      }
    });
  }
  get deducedLayoutDirection() {
    if (!this.props.layoutDirection ||
    //@ts-ignore fix it
    this.props.layoutDirection === 'locale') {
      return _reactNative.I18nManager.isRTL ? 'rtl' : 'ltr';
    } else {
      return this.props.layoutDirection;
    }
  }
  render() {
    return /*#__PURE__*/_react.default.createElement(_PagerViewNativeComponent.default, _extends({}, this.props, {
      ref: ref => {
        this.pagerView = ref;
      },
      style: this.props.style,
      layoutDirection: this.deducedLayoutDirection,
      onPageScroll: this._onPageScroll,
      onPageScrollStateChanged: this._onPageScrollStateChanged,
      onPageSelected: this._onPageSelected,
      onMoveShouldSetResponderCapture: this._onMoveShouldSetResponderCapture,
      children: (0, _utils.childrenWithOverriddenStyle)(this.props.children)
    }));
  }
}
exports.PagerView = PagerView;
//# sourceMappingURL=PagerView.js.map