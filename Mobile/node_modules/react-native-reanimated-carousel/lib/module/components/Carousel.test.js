function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React from "react";
import { Gesture, State } from "react-native-gesture-handler";
import Animated, { interpolate, useDerivedValue, useSharedValue } from "react-native-reanimated";
import { act, render, waitFor } from "@testing-library/react-native";
import { fireGestureHandler, getByGestureTestId } from "react-native-gesture-handler/jest-utils";
import Carousel from "./Carousel";
jest.setTimeout(1000 * 12);
const mockPan = jest.fn();
const realPan = Gesture.Pan();
const gestureTestId = "rnrc-gesture-handler";
jest.spyOn(Gesture, "Pan").mockImplementation(() => {
  mockPan();
  return realPan.withTestId(gestureTestId);
});
describe("Test the real swipe behavior of Carousel to ensure it's working as expected", () => {
  const slideWidth = 300;
  const slideHeight = 200;
  const slideCount = 4;
  beforeEach(() => {
    mockPan.mockClear();
  }); // Helper function to create mock data

  const createMockData = function () {
    let length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : slideCount;
    return Array.from({
      length
    }, (_, i) => `Item ${i + 1}`);
  }; // Helper function to create default props with correct typing


  const createDefaultProps = function (progressAnimVal) {
    let customProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const baseProps = {
      width: slideWidth,
      height: slideHeight,
      data: createMockData(),
      defaultIndex: 0,
      testID: "carousel-swipe-container",
      onProgressChange: progressAnimVal
    };
    return { ...baseProps,
      ...customProps
    };
  }; // Helper function to create test wrapper


  const createCarousel = progress => {
    const Wrapper = /*#__PURE__*/React.forwardRef((customProps, ref) => {
      const progressAnimVal = useSharedValue(progress.current);

      const defaultRenderItem = _ref => {
        let {
          item,
          index
        } = _ref;
        return /*#__PURE__*/React.createElement(Animated.View, {
          testID: `carousel-item-${index}`,
          style: {
            width: slideWidth,
            height: slideHeight,
            flex: 1
          }
        }, item);
      };

      const {
        renderItem = defaultRenderItem,
        ...defaultProps
      } = createDefaultProps(progressAnimVal, customProps);
      useDerivedValue(() => {
        progress.current = progressAnimVal.value;
      }, [progressAnimVal]);
      return /*#__PURE__*/React.createElement(Carousel, _extends({}, defaultProps, {
        renderItem: renderItem,
        ref: ref
      }));
    });
    return Wrapper;
  }; // Helper function to simulate swipe


  const swipeToLeftOnce = function () {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const {
      itemWidth = slideWidth,
      velocityX = -slideWidth
    } = options;
    fireGestureHandler(getByGestureTestId(gestureTestId), [{
      state: State.BEGAN,
      translationX: 0,
      velocityX
    }, {
      state: State.ACTIVE,
      translationX: -itemWidth * 0.25,
      velocityX
    }, {
      state: State.ACTIVE,
      translationX: -itemWidth * 0.5,
      velocityX
    }, {
      state: State.ACTIVE,
      translationX: -itemWidth * 0.75,
      velocityX
    }, {
      state: State.END,
      translationX: -itemWidth,
      velocityX
    }]);
  }; // Helper function to verify initial render


  const verifyInitialRender = async getByTestId => {
    await waitFor(() => {
      const item = getByTestId("carousel-item-0");
      expect(item).toBeTruthy();
    }, {
      timeout: 1000 * 3
    });
  };

  it("`data` prop: should render correctly", async () => {
    const progress = {
      current: 0
    };
    const Wrapper = createCarousel(progress);
    const {
      getByTestId
    } = render( /*#__PURE__*/React.createElement(Wrapper, {
      data: createMockData(6)
    }));
    await verifyInitialRender(getByTestId);
    expect(getByTestId("carousel-item-0")).toBeTruthy();
    expect(getByTestId("carousel-item-1")).toBeTruthy();
    expect(getByTestId("carousel-item-2")).toBeTruthy();
    expect(getByTestId("carousel-item-3")).toBeTruthy();
    expect(getByTestId("carousel-item-4")).toBeTruthy();
    expect(getByTestId("carousel-item-5")).toBeTruthy();
  });
  it("`renderItem` prop: should render items correctly", async () => {
    const progress = {
      current: 0
    };
    const Wrapper = createCarousel(progress);
    const {
      getByTestId
    } = render( /*#__PURE__*/React.createElement(Wrapper, {
      renderItem: _ref2 => {
        let {
          item,
          index
        } = _ref2;
        return /*#__PURE__*/React.createElement(Animated.Text, {
          testID: `item-${index}`
        }, item);
      }
    }));
    await waitFor(() => expect(getByTestId("item-0")).toBeTruthy());
  });
  it("should swipe to the left", async () => {
    const progress = {
      current: 0
    };
    const Wrapper = createCarousel(progress);
    const {
      getByTestId
    } = render( /*#__PURE__*/React.createElement(Wrapper, null));
    await verifyInitialRender(getByTestId); // Test swipe sequence

    for (let i = 1; i <= slideCount; i++) {
      swipeToLeftOnce();
      await waitFor(() => expect(progress.current).toBe(i % slideCount));
    }
  });
  it("`loop` prop: should swipe back to the first item when loop is true", async () => {
    const progress = {
      current: 0
    };
    const Wrapper = createCarousel(progress);
    {
      const {
        getByTestId
      } = render( /*#__PURE__*/React.createElement(Wrapper, {
        loop: true
      }));
      await verifyInitialRender(getByTestId); // Test swipe sequence

      for (let i = 1; i <= slideCount; i++) {
        swipeToLeftOnce();
        await waitFor(() => expect(progress.current).toBe(i % slideCount));
      }
    }
    {
      const {
        getByTestId
      } = render( /*#__PURE__*/React.createElement(Wrapper, {
        loop: false
      }));
      await verifyInitialRender(getByTestId);
      fireGestureHandler(getByGestureTestId(gestureTestId), [{
        state: State.BEGAN,
        translationX: 0
      }, {
        state: State.ACTIVE,
        translationX: slideWidth * 0.25
      }, {
        state: State.END,
        translationX: slideWidth * 0.5
      }]); // Because the loop is false, so the the carousel will swipe back to the first item

      await waitFor(() => expect(progress.current).toBe(0));
    }
  });
  it("`onSnapToItem` prop: should call the onSnapToItem callback", async () => {
    const progress = {
      current: 0
    };
    const onSnapToItem = jest.fn();
    const Wrapper = createCarousel(progress);
    const {
      getByTestId
    } = render( /*#__PURE__*/React.createElement(Wrapper, {
      onSnapToItem: onSnapToItem
    }));
    await verifyInitialRender(getByTestId);
    expect(onSnapToItem).not.toHaveBeenCalled();
    swipeToLeftOnce();
    await waitFor(() => expect(onSnapToItem).toHaveBeenCalledWith(1));
    swipeToLeftOnce();
    await waitFor(() => expect(onSnapToItem).toHaveBeenCalledWith(2));
    swipeToLeftOnce();
    await waitFor(() => expect(onSnapToItem).toHaveBeenCalledWith(3));
  });
  it("`autoPlay` prop: should swipe automatically when autoPlay is true", async () => {
    const progress = {
      current: 0
    };
    const Wrapper = createCarousel(progress);
    const {
      getByTestId
    } = render( /*#__PURE__*/React.createElement(Wrapper, {
      autoPlay: true,
      autoPlayInterval: 300
    }));
    await verifyInitialRender(getByTestId);
    await waitFor(() => expect(progress.current).toBe(1));
    await waitFor(() => expect(progress.current).toBe(2));
    await waitFor(() => expect(progress.current).toBe(3));
    await waitFor(() => expect(progress.current).toBe(0));
  });
  it("`autoPlayReverse` prop: should swipe automatically in reverse when autoPlayReverse is true", async () => {
    const progress = {
      current: 0
    };
    const Wrapper = createCarousel(progress);
    const {
      getByTestId
    } = render( /*#__PURE__*/React.createElement(Wrapper, {
      autoPlay: true,
      autoPlayReverse: true
    }));
    await verifyInitialRender(getByTestId);
    await waitFor(() => expect(progress.current).toBe(3));
    await waitFor(() => expect(progress.current).toBe(2));
    await waitFor(() => expect(progress.current).toBe(1));
    await waitFor(() => expect(progress.current).toBe(0));
  });
  it("`defaultIndex` prop: should render the correct item with the defaultIndex props", async () => {
    const progress = {
      current: 0
    };
    const Wrapper = createCarousel(progress);
    const {
      getByTestId
    } = render( /*#__PURE__*/React.createElement(Wrapper, {
      defaultIndex: 2
    }));
    await verifyInitialRender(getByTestId);
    await waitFor(() => expect(progress.current).toBe(2));
  });
  it("`defaultScrollOffsetValue` prop: should render the correct progress value with the defaultScrollOffsetValue props", async () => {
    const progress = {
      current: 0
    };
    const Wrapper = createCarousel(progress);

    const WrapperWithCustomProps = () => {
      const defaultScrollOffsetValue = useSharedValue(-slideWidth);
      return /*#__PURE__*/React.createElement(Wrapper, {
        defaultScrollOffsetValue: defaultScrollOffsetValue
      });
    };

    render( /*#__PURE__*/React.createElement(WrapperWithCustomProps, null));
    await waitFor(() => expect(progress.current).toBe(1));
  });
  it("`ref` prop: should handle the ref props", async () => {
    const Wrapper = createCarousel({
      current: 0
    });
    const fn = jest.fn();

    const WrapperWithCustomProps = _ref3 => {
      let {
        refSetupCallback
      } = _ref3;
      return /*#__PURE__*/React.createElement(Wrapper, {
        ref: ref => {
          refSetupCallback(!!ref);
        }
      });
    };

    render( /*#__PURE__*/React.createElement(WrapperWithCustomProps, {
      refSetupCallback: fn
    }));
    await waitFor(() => expect(fn).toHaveBeenCalledWith(true));
  });
  it("`autoFillData` prop: should auto fill data array to allow loop playback when the loop props is true", async () => {
    const progress = {
      current: 0
    };
    const Wrapper = createCarousel(progress);
    {
      const {
        getAllByTestId
      } = render( /*#__PURE__*/React.createElement(Wrapper, {
        autoFillData: true,
        data: createMockData(1)
      }));
      await waitFor(() => {
        expect(getAllByTestId("carousel-item-0").length).toBe(3);
      });
    }
    {
      const {
        getAllByTestId
      } = render( /*#__PURE__*/React.createElement(Wrapper, {
        autoFillData: false,
        data: createMockData(1)
      }));
      await waitFor(() => {
        expect(getAllByTestId("carousel-item-0").length).toBe(1);
      });
    }
  });
  it("`pagingEnabled` prop: should swipe to the next item when pagingEnabled is true", async () => {
    const progress = {
      current: 0
    };
    const Wrapper = createCarousel(progress);
    {
      const {
        getByTestId
      } = render( /*#__PURE__*/React.createElement(Wrapper, {
        pagingEnabled: false
      }));
      await verifyInitialRender(getByTestId);
      fireGestureHandler(getByGestureTestId(gestureTestId), [{
        state: State.BEGAN,
        translationX: 0,
        velocityX: -5
      }, {
        state: State.ACTIVE,
        translationX: -slideWidth * 0.15,
        velocityX: -5
      }, {
        state: State.END,
        translationX: -slideWidth * 0.25,
        velocityX: -5
      }]);
      await waitFor(() => expect(progress.current).toBe(0));
    }
    {
      const {
        getByTestId
      } = render( /*#__PURE__*/React.createElement(Wrapper, {
        pagingEnabled: true
      }));
      await verifyInitialRender(getByTestId);
      fireGestureHandler(getByGestureTestId(gestureTestId), [{
        state: State.BEGAN,
        translationX: 0,
        velocityX: -1000
      }, {
        state: State.ACTIVE,
        translationX: -slideWidth * 0.15,
        velocityX: -1000
      }, {
        state: State.END,
        translationX: -slideWidth * 0.25,
        velocityX: -1000
      }]);
      await waitFor(() => expect(progress.current).toBe(1));
    }
  });
  it("`onConfigurePanGesture` prop: should call the onConfigurePanGesture callback", async () => {
    const progress = {
      current: 0
    };
    const Wrapper = createCarousel(progress);
    let _pan = null;
    render( /*#__PURE__*/React.createElement(Wrapper, {
      onConfigurePanGesture: pan => {
        _pan = pan;
        return pan;
      }
    }));
    const {
      getByTestId
    } = render( /*#__PURE__*/React.createElement(Wrapper, {
      pagingEnabled: false
    }));
    await verifyInitialRender(getByTestId);
    expect(_pan).not.toBeNull();
  });
  it("`onScrollStart` prop: should call the onScrollStart callback", async () => {
    const progress = {
      current: 0
    };
    let startedProgress;

    const onScrollStart = () => {
      if (typeof startedProgress === "number") return;
      startedProgress = progress.current;
    };

    const Wrapper = createCarousel(progress);
    const {
      getByTestId
    } = render( /*#__PURE__*/React.createElement(Wrapper, {
      onScrollStart: onScrollStart
    }));
    await verifyInitialRender(getByTestId);
    fireGestureHandler(getByGestureTestId(gestureTestId), [{
      state: State.BEGAN,
      translationX: 0,
      velocityX: 1000
    }, {
      state: State.ACTIVE,
      translationX: slideWidth / 2,
      velocityX: 1000
    }, {
      state: State.END,
      translationX: slideWidth,
      velocityX: 1000
    }]);
    await waitFor(() => {
      expect(startedProgress).toBe(0);
    });
  });
  it("`onScrollEnd` prop: should call the onScrollEnd callback", async () => {
    const progress = {
      current: 0
    };
    let endedProgress;
    const onScrollEnd = jest.fn(() => {
      if (typeof endedProgress === "number") return;
      endedProgress = progress.current;
    });
    const Wrapper = createCarousel(progress);
    const {
      getByTestId
    } = render( /*#__PURE__*/React.createElement(Wrapper, {
      onScrollEnd: onScrollEnd
    }));
    await verifyInitialRender(getByTestId);
    fireGestureHandler(getByGestureTestId(gestureTestId), [{
      state: State.BEGAN,
      translationX: 0,
      velocityX: 1000
    }, {
      state: State.ACTIVE,
      translationX: slideWidth / 2,
      velocityX: 1000
    }, {
      state: State.END,
      translationX: slideWidth,
      velocityX: 1000
    }]);
    await waitFor(() => {
      expect(endedProgress).toBe(3);
      expect(onScrollEnd).toHaveBeenCalledWith(3);
    });
  });
  it("`onProgressChange` prop: should call the onProgressChange callback", async () => {
    const offsetProgressVal = {
      current: 0
    };
    const absoluteProgressVal = {
      current: 0
    };
    const onProgressChange = jest.fn((offsetProgress, absoluteProgress) => {
      offsetProgressVal.current = offsetProgress;
      absoluteProgressVal.current = absoluteProgress;
    });
    const Wrapper = createCarousel(offsetProgressVal);
    const {
      getByTestId
    } = render( /*#__PURE__*/React.createElement(Wrapper, {
      onProgressChange: onProgressChange,
      defaultIndex: 0
    }));
    await verifyInitialRender(getByTestId);
    await waitFor(() => {
      expect(offsetProgressVal.current).toBe(0);
      expect(absoluteProgressVal.current).toBe(0);
    });
    fireGestureHandler(getByGestureTestId(gestureTestId), [{
      state: State.BEGAN,
      translationX: 0,
      velocityX: -1000
    }, {
      state: State.ACTIVE,
      translationX: -slideWidth / 2,
      velocityX: -1000
    }, {
      state: State.END,
      translationX: -slideWidth,
      velocityX: -1000
    }]);
    await waitFor(() => {
      expect(offsetProgressVal.current).toBe(-slideWidth);
      expect(absoluteProgressVal.current).toBe(1);
    });
  });
  it("`fixedDirection` prop: should swipe to the correct direction when fixedDirection is positive", async () => {
    {
      const progress = {
        current: 0
      };
      const Wrapper = createCarousel(progress);
      const {
        getByTestId
      } = render( /*#__PURE__*/React.createElement(Wrapper, {
        fixedDirection: "positive"
      }));
      await verifyInitialRender(getByTestId);
      swipeToLeftOnce({
        velocityX: slideWidth
      });
      await waitFor(() => {
        expect(progress.current).toBe(3);
      });
    }
    {
      const progress = {
        current: 0
      };
      const Wrapper = createCarousel(progress);
      const {
        getByTestId
      } = render( /*#__PURE__*/React.createElement(Wrapper, {
        fixedDirection: "negative"
      }));
      await verifyInitialRender(getByTestId);
      swipeToLeftOnce({
        velocityX: -slideWidth
      });
      await waitFor(() => expect(progress.current).toBe(1));
    }
  });
  it("`customAnimation` prop: should apply the custom animation", async () => {
    const progress = {
      current: 0
    };
    const indexes = {};
    const Wrapper = createCarousel(progress);
    const {
      getByTestId
    } = render( /*#__PURE__*/React.createElement(Wrapper, {
      customAnimation: (value, index) => {
        "worklet";

        indexes[index] = index;
        const zIndex = interpolate(value, [-1, 0, 1], [10, 20, 30]);
        const translateX = interpolate(value, [-2, 0, 1], [-slideWidth, 0, slideWidth]);
        return {
          transform: [{
            translateX
          }],
          zIndex
        };
      }
    }));
    await verifyInitialRender(getByTestId);
    swipeToLeftOnce();
    await waitFor(() => {
      expect(progress.current).toBe(1);
      expect(indexes).toMatchInlineSnapshot(`
        {
          "0": 0,
          "1": 1,
          "2": 2,
          "3": 3,
        }
      `);
    });
  });
  it("`overscrollEnabled` prop: should respect overscrollEnabled=false and prevent scrolling beyond bounds", async () => {
    var _nextSlide, _nextSlide2, _nextSlide3;

    const containerWidth = slideWidth;
    const containerHeight = containerWidth / 2;
    const itemWidth = containerWidth / 4;
    let nextSlide;
    const testId = "CarouselAnimatedView";
    const progress = {
      current: 0
    };
    const Carousel = createCarousel(progress);
    const baseOptions = {
      vertical: false,
      width: itemWidth,
      height: containerHeight,
      style: {
        width: containerWidth
      },
      testID: testId
    };
    const {
      getByTestId
    } = render( /*#__PURE__*/React.createElement(Carousel, _extends({
      ref: ref => {
        if (ref) {
          nextSlide = ref.next;
        }
      }
    }, baseOptions, {
      loop: false,
      overscrollEnabled: false,
      data: createMockData(6),
      pagingEnabled: false
    })));
    await act(() => {
      getByTestId(testId).props.onLayout({
        nativeEvent: {
          layout: {
            width: containerWidth,
            height: containerHeight
          }
        }
      });
    });
    await verifyInitialRender(getByTestId);
    await new Promise(resolve => setTimeout(resolve, 3000)); // The test logic is that the first screen has four elements

    await waitFor(() => {
      expect(progress.current).toBe(0);
    }); // After swiping left twice, the last element is close to the right side of the container

    (_nextSlide = nextSlide) === null || _nextSlide === void 0 ? void 0 : _nextSlide();
    await waitFor(() => {
      expect(progress.current).toBe(1);
    });
    (_nextSlide2 = nextSlide) === null || _nextSlide2 === void 0 ? void 0 : _nextSlide2();
    await waitFor(() => {
      expect(progress.current).toBe(2);
    }); // At this point, swiping left again should stay on the last element, meaning this swipe is invalid

    (_nextSlide3 = nextSlide) === null || _nextSlide3 === void 0 ? void 0 : _nextSlide3();
    await waitFor(() => {
      expect(progress.current).toBe(2);
    });
  });
});
//# sourceMappingURL=Carousel.test.js.map