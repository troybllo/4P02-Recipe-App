import { useAnimatedReaction, useSharedValue } from "react-native-reanimated";
import { computeOffsetIfDataChanged } from "../utils/compute-offset-if-data-changed";
import { computeOffsetIfSizeChanged } from "../utils/compute-offset-if-size-changed";
import { handlerOffsetDirection } from "../utils/handleroffset-direction";
export function useCommonVariables(props) {
  const {
    vertical,
    height,
    width,
    dataLength,
    defaultIndex,
    defaultScrollOffsetValue,
    loop
  } = props;
  const size = vertical ? height : width;
  const defaultHandlerOffsetValue = -Math.abs(defaultIndex * size);

  const _handlerOffset = useSharedValue(defaultHandlerOffsetValue);

  const handlerOffset = defaultScrollOffsetValue !== null && defaultScrollOffsetValue !== void 0 ? defaultScrollOffsetValue : _handlerOffset;
  const prevDataLength = useSharedValue(dataLength);
  const prevSize = useSharedValue(size);
  /**
   * When data changes, we need to compute new index for handlerOffset
   */

  useAnimatedReaction(() => {
    const previousLength = prevDataLength.value;
    const currentLength = dataLength;
    const isLengthChanged = previousLength !== currentLength;
    const shouldComputed = isLengthChanged && loop;
    if (shouldComputed) prevDataLength.value = dataLength;
    return {
      shouldComputed,
      previousLength,
      currentLength
    };
  }, _ref => {
    let {
      shouldComputed,
      previousLength,
      currentLength
    } = _ref;

    if (shouldComputed) {
      // direction -> 1 | -1
      const direction = handlerOffsetDirection(handlerOffset);
      handlerOffset.value = computeOffsetIfDataChanged({
        direction,
        previousLength,
        currentLength,
        size,
        handlerOffset: handlerOffset.value
      });
    }
  }, [dataLength, loop]);
  /**
   * When size changes, we need to compute new index for handlerOffset
   */

  useAnimatedReaction(() => {
    const previousSize = prevSize.value;
    const isSizeChanged = previousSize !== size;
    const shouldComputed = isSizeChanged;
    if (shouldComputed) prevSize.value = size;
    return {
      shouldComputed,
      previousSize,
      size
    };
  }, _ref2 => {
    let {
      shouldComputed,
      previousSize,
      size
    } = _ref2;

    if (shouldComputed) {
      handlerOffset.value = computeOffsetIfSizeChanged({
        handlerOffset: handlerOffset.value,
        prevSize: previousSize,
        size
      });
    }
  }, [size]);
  return {
    size,
    validLength: dataLength - 1,
    handlerOffset
  };
}
//# sourceMappingURL=useCommonVariables.js.map