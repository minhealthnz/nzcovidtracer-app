import { useFocusEffect } from "@react-navigation/native";
import { nanoid } from "@reduxjs/toolkit";
import { useCallback, useRef } from "react";

// TODO extend this with pending, fulfilled etc
export interface RequestState {
  requestId?: string;
}

// This hook prevents previous request state leaking into the current view
// TODO return setRequestId
export function useRequest<T extends RequestState>(request: T) {
  const requestId = _useRequestId();
  return {
    requestId: requestId.current,
    request: request.requestId === requestId.current ? request : undefined,
  };
}

// Generates a requestId that's refreshed on every focus
export function useRequestId() {
  const requestId = _useRequestId();
  return requestId.current;
}

export function _useRequestId() {
  const requestId = useRef(nanoid());
  useFocusEffect(
    useCallback(() => {
      requestId.current = nanoid();
    }, []),
  );
  return requestId;
}
