var _stack=require("./stack");describe("horizontalStackLayout",function(){it("should make the rotateZDeg works properly when it is passed in horizontal-stack mode through modeConfig",function(){var screenWidth=375;var calculator=(0,_stack.horizontalStackLayout)({showLength:3,snapDirection:"left",moveSize:screenWidth,stackInterval:18,scaleInterval:0.04,opacityInterval:0.1,rotateZDeg:30});expect(calculator(-0.5)).toMatchInlineSnapshot(`
      {
        "opacity": 0.625,
        "transform": [
          {
            "translateX": -187.5,
          },
          {
            "scale": 1,
          },
          {
            "rotateZ": "-15deg",
          },
        ],
        "zIndex": 150,
      }
    `);expect(calculator(-1)).toMatchInlineSnapshot(`
      {
        "opacity": 0.25,
        "transform": [
          {
            "translateX": -375,
          },
          {
            "scale": 1,
          },
          {
            "rotateZ": "-30deg",
          },
        ],
        "zIndex": 200,
      }
    `);});});
//# sourceMappingURL=stack.test.js.map