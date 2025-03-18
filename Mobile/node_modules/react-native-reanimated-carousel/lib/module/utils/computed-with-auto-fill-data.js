import { DATA_LENGTH } from "../constants";
const {
  SINGLE_ITEM,
  DOUBLE_ITEM
} = DATA_LENGTH;

function isAutoFillData(params) {
  "worklet";

  return !!params.loop && !!params.autoFillData;
}

export function convertToSharedIndex(params) {
  "worklet";

  const {
    loop,
    rawDataLength,
    index,
    autoFillData
  } = params;

  if (isAutoFillData({
    loop,
    autoFillData
  })) {
    switch (rawDataLength) {
      case SINGLE_ITEM:
        return 0;

      case DOUBLE_ITEM:
        return index % 2;
    }
  }

  return index;
}
export function computedOffsetXValueWithAutoFillData(params) {
  "worklet";

  const {
    rawDataLength,
    value,
    size,
    loop,
    autoFillData
  } = params;

  if (isAutoFillData({
    loop,
    autoFillData
  })) {
    switch (rawDataLength) {
      case SINGLE_ITEM:
        return value % size;

      case DOUBLE_ITEM:
        return value % (size * 2);
    }
  }

  return value;
}
export function computedRealIndexWithAutoFillData(params) {
  const {
    index,
    dataLength,
    loop,
    autoFillData
  } = params;

  if (isAutoFillData({
    loop,
    autoFillData
  })) {
    switch (dataLength) {
      case SINGLE_ITEM:
        return index % 1;

      case DOUBLE_ITEM:
        return index % 2;
    }
  }

  return index;
}
export function computedFillDataWithAutoFillData(params) {
  const {
    data,
    loop,
    autoFillData,
    dataLength
  } = params;

  if (isAutoFillData({
    loop,
    autoFillData
  })) {
    switch (dataLength) {
      case SINGLE_ITEM:
        return [data[0], data[0], data[0]];

      case DOUBLE_ITEM:
        return [data[0], data[1], data[0], data[1]];
    }
  }

  return data;
}
//# sourceMappingURL=computed-with-auto-fill-data.js.map