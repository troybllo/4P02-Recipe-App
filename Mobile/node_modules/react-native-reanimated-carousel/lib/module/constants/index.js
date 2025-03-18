import { Easing as _Easing } from "react-native-reanimated";
export let DATA_LENGTH;

(function (DATA_LENGTH) {
  DATA_LENGTH[DATA_LENGTH["SINGLE_ITEM"] = 1] = "SINGLE_ITEM";
  DATA_LENGTH[DATA_LENGTH["DOUBLE_ITEM"] = 2] = "DOUBLE_ITEM";
})(DATA_LENGTH || (DATA_LENGTH = {}));

export const Easing = {
  easeOutQuart: _Easing.bezier(0.25, 1, 0.5, 1)
};
//# sourceMappingURL=index.js.map