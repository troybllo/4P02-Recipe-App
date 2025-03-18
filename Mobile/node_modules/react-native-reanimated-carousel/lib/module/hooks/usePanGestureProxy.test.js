import React from "react";
import { Text } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView, State } from "react-native-gesture-handler";
import { cleanup, render } from "@testing-library/react-native";
import { fireGestureHandler, getByGestureTestId } from "react-native-gesture-handler/jest-utils";
import { usePanGestureProxy } from "./usePanGestureProxy";
beforeEach(cleanup);

const mockedEventHandlers = () => {
  return {
    begin: jest.fn(),
    start: jest.fn(),
    active: jest.fn(),
    end: jest.fn(),
    fail: jest.fn(),
    cancel: jest.fn(),
    finish: jest.fn()
  };
};

const mockedEventHandlersFromUser = () => {
  return {
    begin: jest.fn(),
    start: jest.fn(),
    active: jest.fn(),
    end: jest.fn(),
    fail: jest.fn(),
    cancel: jest.fn(),
    finish: jest.fn()
  };
};

describe("Using RNGH v2 gesture API", () => {
  function SingleHandler(_ref) {
    let {
      handlers,
      handlersFromUser,
      treatStartAsUpdate
    } = _ref;
    const pan = usePanGestureProxy({
      onConfigurePanGesture: gesture => {
        // This is user's customizations
        gesture.onBegin(handlersFromUser.begin).onUpdate(handlersFromUser.active).onEnd(handlersFromUser.end).onFinalize(handlers.finish).withTestId("pan");
      },
      onGestureStart: treatStartAsUpdate ? handlers.active : handlers.start,
      onGestureUpdate: handlers.active,
      onGestureEnd: handlers.end,
      options: {
        enabled: true
      }
    });
    return /*#__PURE__*/React.createElement(GestureHandlerRootView, null, /*#__PURE__*/React.createElement(GestureDetector, {
      gesture: pan
    }, /*#__PURE__*/React.createElement(Text, null, "v2 API test")));
  }

  function RacingHandlers(_ref2) {
    let {
      tapHandlers,
      panHandlers
    } = _ref2;
    const tap = Gesture.Tap().onBegin(tapHandlers.begin).onEnd(tapHandlers.end).withTestId("tap");
    const pan = usePanGestureProxy({
      onConfigurePanGesture: _ => {
        _.onBegin(panHandlers.begin).onFinalize(panHandlers.finish).withTestId("pan");
      },
      onGestureStart: panHandlers.start,
      onGestureUpdate: panHandlers.active,
      onGestureEnd: panHandlers.end,
      options: {
        enabled: true
      }
    });
    return /*#__PURE__*/React.createElement(GestureHandlerRootView, null, /*#__PURE__*/React.createElement(GestureDetector, {
      gesture: Gesture.Race(tap, pan)
    }, /*#__PURE__*/React.createElement(Text, null, "v2 API test")));
  }

  it("sends events to handlers", () => {
    const tapHandlers = mockedEventHandlers();
    const panHandlers = mockedEventHandlers();
    render( /*#__PURE__*/React.createElement(RacingHandlers, {
      tapHandlers: tapHandlers,
      panHandlers: panHandlers
    }));
    fireGestureHandler(getByGestureTestId("pan"), [{
      state: State.BEGAN
    }, {
      state: State.ACTIVE
    }, {
      state: State.END
    }]);
    expect(panHandlers.begin).toBeCalledWith(expect.objectContaining({
      state: State.BEGAN
    }));
    expect(panHandlers.finish).toBeCalled();
    expect(tapHandlers.begin).not.toBeCalled();
  });
  it("sends events with additional data to handlers", () => {
    const panHandlers = mockedEventHandlers();
    const panHandlersFromUser = mockedEventHandlersFromUser();
    render( /*#__PURE__*/React.createElement(SingleHandler, {
      handlers: panHandlers,
      handlersFromUser: panHandlersFromUser,
      treatStartAsUpdate: true
    }));
    fireGestureHandler(getByGestureTestId("pan"), [{
      state: State.BEGAN,
      translationX: 0
    }, {
      state: State.ACTIVE,
      translationX: 10
    }, {
      translationX: 20
    }, {
      translationX: 20
    }, {
      state: State.END,
      translationX: 30
    }]);
    expect(panHandlersFromUser.begin).toBeCalledTimes(1);
    expect(panHandlersFromUser.active).toBeCalledTimes(2);
    expect(panHandlersFromUser.end).toBeCalledTimes(1);
    expect(panHandlers.active).toBeCalledTimes(3);
    expect(panHandlers.active).toHaveBeenLastCalledWith(expect.objectContaining({
      translationX: 20
    }));
  });
  it("does not include console.error in the output", () => {
    // if react-native-gesture-handler detects that some handlers are
    // workletized and some are not, it will log an error to the
    // console. We'd like to make sure that this doesn't happen.
    // The error that would be shown looks like:
    // [react-native-gesture-handler] Some of the callbacks in the gesture are worklets and some are not. Either make sure that all calbacks are marked as 'worklet' if you wish to run them on the UI thread or use '.runOnJS(true)' modifier on the gesture explicitly to run all callbacks on the JS thread.
    const panHandlers = mockedEventHandlers();
    const panHandlersFromUser = mockedEventHandlersFromUser();
    jest.spyOn(console, "error");
    render( /*#__PURE__*/React.createElement(SingleHandler, {
      handlers: panHandlers,
      handlersFromUser: panHandlersFromUser,
      treatStartAsUpdate: true
    }));
    fireGestureHandler(getByGestureTestId("pan"), [{
      state: State.BEGAN
    }, {
      state: State.ACTIVE
    }, {
      state: State.END
    }]);
    expect(console.error).not.toBeCalled();
  });
});
describe("Event list validation", () => {
  function SingleHandler(_ref3) {
    let {
      handlers,
      handlersFromUser,
      treatStartAsUpdate
    } = _ref3;
    const pan = usePanGestureProxy({
      onConfigurePanGesture: _ => {
        _.onBegin(handlersFromUser.begin).onUpdate(handlersFromUser.active).onEnd(handlersFromUser.end).onFinalize(handlers.finish).withTestId("pan");
      },
      onGestureStart: treatStartAsUpdate ? handlers.active : handlers.start,
      onGestureUpdate: handlers.active,
      onGestureEnd: handlers.end,
      options: {
        enabled: true
      }
    });
    return /*#__PURE__*/React.createElement(GestureHandlerRootView, null, /*#__PURE__*/React.createElement(GestureDetector, {
      gesture: pan
    }, /*#__PURE__*/React.createElement(Text, null, "v2 API test")));
  }

  it("throws error when oldState doesn't correspond to previous event's state", () => {
    const panHandlers = mockedEventHandlers();
    const panHandlersFromUser = mockedEventHandlersFromUser();
    render( /*#__PURE__*/React.createElement(SingleHandler, {
      handlers: panHandlers,
      handlersFromUser: panHandlersFromUser
    }));
    expect(() => {
      fireGestureHandler(getByGestureTestId("pan"), [{
        oldState: State.UNDETERMINED,
        state: State.BEGAN,
        x: 0,
        y: 10
      }, {
        oldState: State.UNDETERMINED,
        state: State.ACTIVE,
        x: 1,
        y: 11
      }]);
    }).toThrow("when state changes, oldState should be the same as previous event' state");
  });
  it.each([[State.END], [State.FAILED], [State.CANCELLED]])("correctly handles events ending with state %s", lastState => {
    const panHandlers = mockedEventHandlers();
    const panHandlersFromUser = mockedEventHandlersFromUser();
    render( /*#__PURE__*/React.createElement(SingleHandler, {
      handlers: panHandlers,
      handlersFromUser: panHandlersFromUser
    }));
    fireGestureHandler(getByGestureTestId("pan"), [{
      state: State.BEGAN
    }, {
      state: State.ACTIVE
    }, {
      state: lastState
    }]);
    expect(panHandlersFromUser.begin).toBeCalledTimes(1);
    expect(panHandlersFromUser.active).toBeCalledTimes(0);
    expect(panHandlersFromUser.end).toBeCalledTimes(1);
    if (lastState === State.END) expect(panHandlers.end).toBeCalled();else expect(panHandlers.finish).toBeCalledWith(expect.any(Object), false);
  });
});
describe("Filling event list with defaults", () => {
  function RacingTapAndPan(_ref4) {
    let {
      handlers,
      treatStartAsUpdate
    } = _ref4;
    const tap = Gesture.Tap().onBegin(handlers.begin).onEnd(handlers.end).withTestId("tap");
    const pan = usePanGestureProxy({
      onConfigurePanGesture: _ => {
        _.onBegin(handlers.begin).onFinalize(handlers.finish).withTestId("pan");
      },
      onGestureStart: treatStartAsUpdate ? handlers.active : handlers.start,
      onGestureUpdate: handlers.active,
      onGestureEnd: handlers.end,
      options: {
        enabled: true
      }
    });
    return /*#__PURE__*/React.createElement(GestureHandlerRootView, null, /*#__PURE__*/React.createElement(GestureDetector, {
      gesture: Gesture.Exclusive(pan, tap)
    }, /*#__PURE__*/React.createElement(Text, null, "v2 API test")));
  }

  it("fills oldState if not passed", () => {
    const handlers = mockedEventHandlers();
    render( /*#__PURE__*/React.createElement(RacingTapAndPan, {
      handlers: handlers,
      treatStartAsUpdate: true
    }));
    fireGestureHandler(getByGestureTestId("pan"), [{
      state: State.BEGAN
    }, {
      state: State.ACTIVE
    }, {
      state: State.ACTIVE
    }, {
      state: State.ACTIVE
    }, {
      state: State.END
    }]);
    expect(handlers.begin).toBeCalledWith(expect.objectContaining({
      oldState: State.UNDETERMINED
    }));
    expect(handlers.active).nthCalledWith(1, expect.objectContaining({
      oldState: State.BEGAN
    }));
    expect(handlers.active).lastCalledWith(expect.not.objectContaining({
      oldState: expect.anything()
    }));
    expect(handlers.end).toBeCalledWith(expect.objectContaining({
      oldState: State.ACTIVE
    }), true);
  });
  it("fills missing ACTIVE states", () => {
    const panHandlers = mockedEventHandlers();
    render( /*#__PURE__*/React.createElement(RacingTapAndPan, {
      handlers: panHandlers,
      treatStartAsUpdate: true
    }));
    fireGestureHandler(getByGestureTestId("pan"), [{
      state: State.BEGAN,
      x: 0,
      y: 10
    }, {
      state: State.ACTIVE,
      x: 1,
      y: 11
    }, {
      x: 2,
      y: 12
    }, {
      x: 3,
      y: 13
    }, {
      state: State.END,
      x: 4,
      y: 14
    }]);
    expect(panHandlers.active).toBeCalledTimes(3);
    expect(panHandlers.active).toHaveBeenLastCalledWith(expect.objectContaining({
      x: 3,
      y: 13
    }));
  });
  it("fills BEGIN and END events for discrete handlers", () => {
    const handlers = mockedEventHandlers();
    render( /*#__PURE__*/React.createElement(RacingTapAndPan, {
      handlers: handlers,
      treatStartAsUpdate: true
    }));
    fireGestureHandler(getByGestureTestId("tap"), [{
      x: 5
    }]);
    expect(handlers.begin).toBeCalledTimes(1);
    expect(handlers.end).toBeCalledTimes(1);
  });
  it("with FAILED event, fills BEGIN event for discrete handlers", () => {
    const handlers = mockedEventHandlers();
    render( /*#__PURE__*/React.createElement(RacingTapAndPan, {
      handlers: handlers,
      treatStartAsUpdate: true
    }));
    fireGestureHandler(getByGestureTestId("tap"), [{
      state: State.FAILED
    }]);
    expect(handlers.begin).toBeCalledTimes(1);
    expect(handlers.end).toBeCalledTimes(1);
    expect(handlers.end).toBeCalledWith(expect.anything(), false);
  });
  it("uses event data from first event in filled BEGIN, ACTIVE events", () => {
    const handlers = mockedEventHandlers();
    render( /*#__PURE__*/React.createElement(RacingTapAndPan, {
      handlers: handlers,
      treatStartAsUpdate: true
    }));
    fireGestureHandler(getByGestureTestId("pan"), [{
      x: 120
    }]);
    expect(handlers.begin).toBeCalledWith(expect.objectContaining({
      x: 120
    }));
    expect(handlers.active).toHaveBeenNthCalledWith(1, expect.objectContaining({
      x: 120
    }));
  });
  it("uses event data from last event in filled END events", () => {
    const handlers = mockedEventHandlers();
    render( /*#__PURE__*/React.createElement(RacingTapAndPan, {
      handlers: handlers,
      treatStartAsUpdate: true
    }));
    fireGestureHandler(getByGestureTestId("pan"), [{
      x: 120,
      state: State.FAILED
    }]);
    expect(handlers.begin).toBeCalledTimes(1);
    expect(handlers.active).toBeCalledTimes(1);
    expect(handlers.end).toBeCalledWith(expect.objectContaining({
      x: 120
    }), false);
  });
  it("uses event data filled events", () => {
    const handlers = mockedEventHandlers();
    render( /*#__PURE__*/React.createElement(RacingTapAndPan, {
      handlers: handlers,
      treatStartAsUpdate: true
    }));
    fireGestureHandler(getByGestureTestId("pan"), [{
      x: 5,
      y: 15
    }, {
      x: 6,
      y: 16
    }, {
      x: 7,
      y: 17
    }]);
    expect(handlers.begin).toBeCalledWith(expect.objectContaining({
      x: 5,
      y: 15
    }));
    expect(handlers.active).toBeCalledTimes(3);
    expect(handlers.end).toBeCalledWith(expect.objectContaining({
      x: 7,
      y: 17
    }), true);
  });
  it("fills BEGIN and END events when they're not present, for discrete handlers", () => {
    const handlers = mockedEventHandlers();
    render( /*#__PURE__*/React.createElement(RacingTapAndPan, {
      handlers: handlers,
      treatStartAsUpdate: true
    }));
    fireGestureHandler(getByGestureTestId("tap"));
    expect(handlers.begin).toBeCalledTimes(1);
    expect(handlers.end).toHaveBeenCalledTimes(1);
  });
  it("fills BEGIN, ACTIVE and END events when they're not present, for continuous handlers", () => {
    const handlers = mockedEventHandlers();
    render( /*#__PURE__*/React.createElement(RacingTapAndPan, {
      handlers: handlers,
      treatStartAsUpdate: true
    }));
    fireGestureHandler(getByGestureTestId("pan"));
    expect(handlers.begin).toBeCalledTimes(1);
    expect(handlers.active).toBeCalledTimes(1);
    expect(handlers.end).toHaveBeenCalledTimes(1);
  });
});
//# sourceMappingURL=usePanGestureProxy.test.js.map