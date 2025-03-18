import React from "react";
export const LazyView = props => {
  const {
    shouldUpdate,
    children
  } = props;
  if (!shouldUpdate) return /*#__PURE__*/React.createElement(React.Fragment, null);
  return /*#__PURE__*/React.createElement(React.Fragment, null, children);
};
//# sourceMappingURL=LazyView.js.map