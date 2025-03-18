import { withSpring, withTiming } from "react-native-reanimated";
export function dealWithAnimation(withAnimation) {
  "worklet";

  switch (withAnimation.type) {
    case "spring":
      return (value, cb) => withSpring(value, withAnimation.config, isFinished => cb(isFinished));

    case "timing":
      return (value, cb) => withTiming(value, withAnimation.config, isFinished => cb(isFinished));
  }
}
//# sourceMappingURL=deal-with-animation.js.map