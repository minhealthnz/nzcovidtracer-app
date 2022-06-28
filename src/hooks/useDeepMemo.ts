import _ from "lodash";
import React from "react";

export function useDeepMemo<T>(value: T) {
  const ref = React.useRef<T>();

  if (!_.isEqual(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

export default useDeepMemo;
