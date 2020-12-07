import { useCavy, wrap } from "cavy";
import React from "react";

export function testable<P>(
  FunctionalComponent: React.FunctionComponent<P>,
): React.FunctionComponent<P & { testID?: string }> {
  if (!__DEV__) {
    return FunctionalComponent;
  }

  const ClassComponent = wrap(FunctionalComponent);

  return (props: P & { testID?: string }) => {
    const generateTestHook = useCavy();

    return (
      <ClassComponent
        {...props}
        ref={props.testID == null ? undefined : generateTestHook(props.testID)}
      />
    );
  };
}
