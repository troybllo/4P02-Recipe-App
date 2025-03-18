var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");var _asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));var _reactNativeReanimated=require("react-native-reanimated");var _reactHooks=require("@testing-library/react-hooks");var _useVisibleRanges=require("./useVisibleRanges");var viewSize=393;describe("useVisibleRanges",function(){it("should only display the front of the list when loop is false",(0,_asyncToGenerator2.default)(function*(){var hook=(0,_reactHooks.renderHook)(function(){var translation=(0,_reactNativeReanimated.useSharedValue)(-0);var range=(0,_useVisibleRanges.useVisibleRanges)({total:10,translation:translation,viewSize:viewSize,windowSize:4,loop:false});return range;});var expected=hook.result.current.value;expect(expected).toMatchInlineSnapshot(`
            {
              "negativeRange": [
                -3,
                0,
              ],
              "positiveRange": [
                0,
                3,
              ],
            }
        `);}));it("should display the rear of the list and the front of the list when loop is true",(0,_asyncToGenerator2.default)(function*(){var hook=(0,_reactHooks.renderHook)(function(){var translation=(0,_reactNativeReanimated.useSharedValue)(-0);var range=(0,_useVisibleRanges.useVisibleRanges)({total:10,translation:translation,viewSize:viewSize,windowSize:4,loop:true});return range;});var expected=hook.result.current.value;expect(expected).toMatchInlineSnapshot(`
            {
              "negativeRange": [
                8,
                9,
              ],
              "positiveRange": [
                0,
                2,
              ],
            }
        `);}));it("should shows the increased range of the list when the loop is false and swiped the carousel.",(0,_asyncToGenerator2.default)(function*(){var slide0hook=(0,_reactHooks.renderHook)(function(){var translation=(0,_reactNativeReanimated.useSharedValue)(-0*viewSize);var range=(0,_useVisibleRanges.useVisibleRanges)({total:10,translation:translation,viewSize:viewSize,windowSize:4,loop:false});return range;}).result.current.value;var slide1hook=(0,_reactHooks.renderHook)(function(){var translation=(0,_reactNativeReanimated.useSharedValue)(-1*viewSize);var range=(0,_useVisibleRanges.useVisibleRanges)({total:10,translation:translation,viewSize:viewSize,windowSize:4,loop:false});return range;}).result.current.value;var slide2hook=(0,_reactHooks.renderHook)(function(){var translation=(0,_reactNativeReanimated.useSharedValue)(-2*viewSize);var range=(0,_useVisibleRanges.useVisibleRanges)({total:10,translation:translation,viewSize:viewSize,windowSize:4,loop:false});return range;}).result.current.value;var slide3hook=(0,_reactHooks.renderHook)(function(){var translation=(0,_reactNativeReanimated.useSharedValue)(-3*viewSize);var range=(0,_useVisibleRanges.useVisibleRanges)({total:10,translation:translation,viewSize:viewSize,windowSize:4,loop:false});return range;}).result.current.value;expect(slide0hook).toMatchInlineSnapshot(`
            {
              "negativeRange": [
                -3,
                0,
              ],
              "positiveRange": [
                0,
                3,
              ],
            }
        `);expect(slide1hook).toMatchInlineSnapshot(`
            {
              "negativeRange": [
                -2,
                1,
              ],
              "positiveRange": [
                1,
                4,
              ],
            }
        `);expect(slide2hook).toMatchInlineSnapshot(`
            {
              "negativeRange": [
                -1,
                2,
              ],
              "positiveRange": [
                2,
                5,
              ],
            }
        `);expect(slide3hook).toMatchInlineSnapshot(`
            {
              "negativeRange": [
                0,
                3,
              ],
              "positiveRange": [
                3,
                6,
              ],
            }
        `);}));});
//# sourceMappingURL=useVisibleRanges.test.js.map