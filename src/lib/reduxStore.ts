import { rootReducer } from "@domain/rootReducer";
import { createLogger } from "@logger/createLogger";
import { logPerformance } from "@logger/logPerformance";
import {
  configureStore as baseConfigureStore,
  getDefaultMiddleware,
  Store,
} from "@reduxjs/toolkit";
import Reactotron from "reactotron-react-native";
import { persistStore } from "redux-persist";
import createSagaMiddleware from "redux-saga";

import reactotron from "../../reactotronConfig";
import rootSaga from "./rootSaga";
import { _persistorRef, _storeRef } from "./storeRefs";

const { logError } = createLogger("store");

const sagaMonitor = Reactotron.createSagaMonitor!();

const sagaMiddleware = createSagaMiddleware({
  sagaMonitor,
  onError: (err) => {
    logError(err);
  },
});

export function createStore(): ReturnType<typeof _createStore> {
  if (_storeRef.current != null) {
    return _storeRef.current;
  }
  const store = _createStore();
  logPerformance("launch", "created store");
  _storeRef.current = store;
  return store;
}

function _createStore() {
  return baseConfigureStore({
    reducer: rootReducer,
    enhancers: [reactotron.createEnhancer!()],
    middleware: getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(sagaMiddleware),
  });
}

export function createPersistor(store: Store) {
  if (_persistorRef.current != null) {
    return _persistorRef.current;
  }
  const persistor = persistStore(store, undefined, () => {
    logPerformance("launch", "rehydrated persistor");
    sagaMiddleware.run(rootSaga);
  });
  _persistorRef.current = persistor;
  return persistor;
}
