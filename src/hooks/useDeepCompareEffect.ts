import _ from "lodash";
import React from "react";

export function useDeepMemo<T>(value: T) {
  const ref = React.useRef<T>();

  if (!_.isEqual(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

/**
 * Please use useDeepCompareEffect only if ABSOLUTELY necessary.
 * Stick to React.useEffect unless you REALLY need to do a deep comparison
 */
export function useDeepCompareEffect(
  effect: React.EffectCallback,
  dependencies: React.DependencyList | undefined,
) {
  React.useEffect(
    effect,
    useDeepMemo<React.DependencyList | undefined>(dependencies),
  );
}

export default useDeepCompareEffect;
