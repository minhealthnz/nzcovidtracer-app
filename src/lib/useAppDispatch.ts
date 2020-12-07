import { useDispatch } from "react-redux";

import { createStore } from "./reduxStore";

function _getDispatch() {
  return createStore().dispatch;
}

export type AppDispatch = ReturnType<typeof _getDispatch>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
