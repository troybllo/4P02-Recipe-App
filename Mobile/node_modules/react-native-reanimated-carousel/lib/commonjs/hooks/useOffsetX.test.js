var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");var _asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));var _reactNativeReanimated=require("react-native-reanimated");var _reactHooks=require("@testing-library/react-hooks");var _useOffsetX=require("./useOffsetX");describe("useSharedValue",function(){it("should return the correct values",(0,_asyncToGenerator2.default)(function*(){var hook=(0,_reactHooks.renderHook)(function(){var range=(0,_reactNativeReanimated.useSharedValue)({negativeRange:[7,9],positiveRange:[0,3]});var inputs=Array.from({length:10}).map(function(_,index){return{config:{dataLength:10,handlerOffset:(0,_reactNativeReanimated.useSharedValue)(-0),index:index,loop:false,size:393},range:range};});return inputs.map(function(input){var config=input.config,range=input.range;return(0,_useOffsetX.useOffsetX)(config,range);});});var expected=hook.result.current.map(function(v){return v.value;}).slice();expect(expected).toMatchInlineSnapshot(`
            [
              0,
              393,
              786,
              1179,
              9007199254740991,
              9007199254740991,
              9007199254740991,
              2751,
              3144,
              3537,
            ]
        `);}));});
//# sourceMappingURL=useOffsetX.test.js.map