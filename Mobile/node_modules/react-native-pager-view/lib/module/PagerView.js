function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React from 'react';
import { Platform, Keyboard } from 'react-native';
import { I18nManager } from 'react-native';
import { childrenWithOverriddenStyle } from './utils';
import PagerViewNativeComponent, { Commands as PagerViewNativeCommands } from './PagerViewNativeComponent';

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

export class PagerView extends React.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "isScrolling", false);
    _defineProperty(this, "pagerView", null);
    _defineProperty(this, "_onPageScroll", e => {
      if (this.props.onPageScroll) {
        this.props.onPageScroll(e);
      }

      // Not implemented on iOS yet
      if (Platform.OS === 'android') {
        if (this.props.keyboardDismissMode === 'on-drag') {
          Keyboard.dismiss();
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
        PagerViewNativeCommands.setPage(this.pagerView, selectedPage);
      }
    });
    /**
     * A helper function to scroll to a specific page in the PagerView.
     * The transition between pages will *not* be animated.
     */
    _defineProperty(this, "setPageWithoutAnimation", selectedPage => {
      if (this.pagerView) {
        PagerViewNativeCommands.setPageWithoutAnimation(this.pagerView, selectedPage);
      }
    });
    /**
     * A helper function to enable/disable scroll imperatively
     * The recommended way is using the scrollEnabled prop, however, there might be a case where a
     * imperative solution is more useful (e.g. for not blocking an animation)
     */
    _defineProperty(this, "setScrollEnabled", scrollEnabled => {
      if (this.pagerView) {
        PagerViewNativeCommands.setScrollEnabledImperatively(this.pagerView, scrollEnabled);
      }
    });
  }
  get deducedLayoutDirection() {
    if (!this.props.layoutDirection ||
    //@ts-ignore fix it
    this.props.layoutDirection === 'locale') {
      return I18nManager.isRTL ? 'rtl' : 'ltr';
    } else {
      return this.props.layoutDirection;
    }
  }
  render() {
    return /*#__PURE__*/React.createElement(PagerViewNativeComponent, _extends({}, this.props, {
      ref: ref => {
        this.pagerView = ref;
      },
      style: this.props.style,
      layoutDirection: this.deducedLayoutDirection,
      onPageScroll: this._onPageScroll,
      onPageScrollStateChanged: this._onPageScrollStateChanged,
      onPageSelected: this._onPageSelected,
      onMoveShouldSetResponderCapture: this._onMoveShouldSetResponderCapture,
      children: childrenWithOverriddenStyle(this.props.children)
    }));
  }
}
//# sourceMappingURL=PagerView.js.map