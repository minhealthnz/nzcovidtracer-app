import { createRef, MutableRefObject } from "react";
import { Store } from "redux";
import { Persistor } from "redux-persist";

export const _storeRef: MutableRefObject<Store | null> = createRef<Store>();
export const _persistorRef: MutableRefObject<Persistor | null> =
  createRef<Persistor>();
